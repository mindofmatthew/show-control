const imageFormats = ['.jpg', '.jpeg', '.png', '.webp'];
const videoFormats = ['.mp4', '.webm'];

function main() {
  let projections = {};

  function setUpWebSocket() {
    const ws = new WebSocket(`ws:${location.host}/plugins/projection/_/feed`);

    ws.addEventListener('open', () => {
      console.info('Connection established');
    });

    ws.addEventListener('message', m => {
      let action = JSON.parse(m.data);

      switch (action.type) {
        case 'ADD':
          for (let projection of action.projections) {
            projections[projection.id] = new Projection(
              projection.asset,
              projection.corners
            );
          }
          break;
        case 'DELETE':
          delete projections[action.id];
          break;
        case 'EDIT_CORNERS':
          projections[action.id].updateCorners(action.corners);
          break;
        case 'EDIT_ASSET':
          projections[action.id].updateAsset(action.asset);
          break;
        case 'SET_CURRENT_PROJECTIONS':
          for (const [id, projection] of Object.entries(projections)) {
            projection.enabled = action.ids.includes(id);
          }
          break;
      }
    });

    ws.addEventListener('close', () => {
      console.info('Lost websocket connection, attempting to reconnect');
      setTimeout(setUpWebSocket, 1000);
    });
  }
  setUpWebSocket();
}

function unpackCorners({ northwest, northeast, southwest, southeast }) {
  return [
    northwest.x,
    northwest.y,
    northeast.x,
    northeast.y,
    southwest.x,
    southwest.y,
    southeast.x,
    southeast.y
  ];
}

class Projection {
  constructor(asset, corners) {
    this.element = null;

    this.updateAsset(asset);
    this.updateCorners(corners);
  }

  updateAsset(path) {
    if (this.element) {
      document.body.removeChild(this.element);
    }

    if (imageFormats.some(ext => path.endsWith(ext))) {
      // Image format
      this.element = document.createElement('img');
      this.element.src = `/assets/${path}`;
    } else if (videoFormats.some(ext => path.endsWith(ext))) {
      // Video format
      this.element = document.createElement('video');
      this.element.src = `/assets/${path}`;
    } else {
      this.element = document.createElement('div');
      this.element.classList.add('empty');
    }

    document.body.appendChild(this.element);
  }

  updateCorners(corners) {
    let positions = unpackCorners(corners);
    positions = positions.map((pos, index) => {
      if (index % 2 === 0) {
        return pos * window.innerWidth;
      } else {
        return pos * window.innerHeight;
      }
    });

    console.log(positions);

    transform2d(this.element, ...positions);
  }

  dispose() {
    document.body.removeChild(this.element);
  }
}

window.addEventListener('load', main);

// 3D Stuff
// From: http://jsfiddle.net/dFrHS/1/
function adj(m) {
  // Compute the adjugate of m
  return [
    m[4] * m[8] - m[5] * m[7],
    m[2] * m[7] - m[1] * m[8],
    m[1] * m[5] - m[2] * m[4],
    m[5] * m[6] - m[3] * m[8],
    m[0] * m[8] - m[2] * m[6],
    m[2] * m[3] - m[0] * m[5],
    m[3] * m[7] - m[4] * m[6],
    m[1] * m[6] - m[0] * m[7],
    m[0] * m[4] - m[1] * m[3]
  ];
}

function multmm(a, b) {
  // multiply two matrices
  var c = Array(9);
  for (var i = 0; i != 3; ++i) {
    for (var j = 0; j != 3; ++j) {
      var cij = 0;
      for (var k = 0; k != 3; ++k) {
        cij += a[3 * i + k] * b[3 * k + j];
      }
      c[3 * i + j] = cij;
    }
  }
  return c;
}

function multmv(m, v) {
  // multiply matrix and vector
  return [
    m[0] * v[0] + m[1] * v[1] + m[2] * v[2],
    m[3] * v[0] + m[4] * v[1] + m[5] * v[2],
    m[6] * v[0] + m[7] * v[1] + m[8] * v[2]
  ];
}

function pdbg(m, v) {
  var r = multmv(m, v);
  return r + ' (' + r[0] / r[2] + ', ' + r[1] / r[2] + ')';
}

function basisToPoints(x1, y1, x2, y2, x3, y3, x4, y4) {
  var m = [x1, x2, x3, y1, y2, y3, 1, 1, 1];
  var v = multmv(adj(m), [x4, y4, 1]);
  return multmm(m, [v[0], 0, 0, 0, v[1], 0, 0, 0, v[2]]);
}

function general2DProjection(
  x1s,
  y1s,
  x1d,
  y1d,
  x2s,
  y2s,
  x2d,
  y2d,
  x3s,
  y3s,
  x3d,
  y3d,
  x4s,
  y4s,
  x4d,
  y4d
) {
  var s = basisToPoints(x1s, y1s, x2s, y2s, x3s, y3s, x4s, y4s);
  var d = basisToPoints(x1d, y1d, x2d, y2d, x3d, y3d, x4d, y4d);
  return multmm(d, adj(s));
}

function project(m, x, y) {
  var v = multmv(m, [x, y, 1]);
  return [v[0] / v[2], v[1] / v[2]];
}

function transform2d(elt, x1, y1, x2, y2, x3, y3, x4, y4) {
  var w = elt.offsetWidth,
    h = elt.offsetHeight;
  console.log(w, h);
  var t = general2DProjection(
    0,
    0,
    x1,
    y1,
    w,
    0,
    x2,
    y2,
    0,
    h,
    x3,
    y3,
    w,
    h,
    x4,
    y4
  );
  for (i = 0; i != 9; ++i) t[i] = t[i] / t[8];
  t = [
    t[0],
    t[3],
    0,
    t[6],
    t[1],
    t[4],
    0,
    t[7],
    0,
    0,
    1,
    0,
    t[2],
    t[5],
    0,
    t[8]
  ];
  t = 'matrix3d(' + t.join(', ') + ')';
  elt.style.transform = t;
}
