const imageFormats = ['.jpg', '.jpeg', '.png', '.webp'];
const videoFormats = ['.mp4', '.webm'];

async function main() {
  //Set up canvas resizing
  const canvas = document.getElementById('renderer');

  function resize() {
    let { width, height } = document.body.getBoundingClientRect();

    canvas.width = width;
    canvas.height = height;
  }

  window.addEventListener('resize', resize);
  resize();

  // Set up rendering context
  const context = canvas.getContext('webgl');
  context.clearColor(0.0, 0.0, 0.0, 1.0);

  // Install shaders
  async function loadShader(type, path) {
    const shader = context.createShader(type);

    const source = await (await fetch(path)).text();

    context.shaderSource(shader, source);
    context.compileShader(shader);

    // See if it compiled successfully
    if (!context.getShaderParameter(shader, context.COMPILE_STATUS)) {
      console.error(
        'An error occurred compiling the shaders: ' +
          context.getShaderInfoLog(shader)
      );
      context.deleteShader(shader);
      return null;
    }

    return shader;
  }

  const vertexShader = await loadShader(
    context.VERTEX_SHADER,
    'shaders/vert.glsl'
  );

  const fragmentShader = await loadShader(
    context.FRAGMENT_SHADER,
    'shaders/frag.glsl'
  );

  const shaderProgram = context.createProgram();
  context.attachShader(shaderProgram, vertexShader);
  context.attachShader(shaderProgram, fragmentShader);
  context.linkProgram(shaderProgram);

  // If creating the shader program failed, alert
  if (!context.getProgramParameter(shaderProgram, context.LINK_STATUS)) {
    console.error(
      'Unable to initialize the shader program: ' +
        context.getProgramInfoLog(shaderProgram)
    );
  }

  let projections = {};

  //Set up websocket
  const ws = new WebSocket(`ws:${location.host}/plugins/projection/_/feed`);
  ws.addEventListener('message', m => {
    let action = JSON.parse(m.data);

    switch (action.type) {
      case 'ADD':
        for (let projection of action.projections) {
          projections[projection.id] = new Projection(
            context,
            shaderProgram,
            projection.corners,
            projection.asset
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

    render();
  });

  requestAnimationFrame(render);

  function render() {
    context.clear(context.COLOR_BUFFER_BIT);
    context.useProgram(shaderProgram);

    for (let id in projections) {
      projections[id].render();
    }

    requestAnimationFrame(render);
  }
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
  constructor(context, shaderProgram, corners, asset) {
    this.gl = context;
    this.shader = shaderProgram;
    this.buffer = this.gl.createBuffer();
    this.texCoordBuffer = this.gl.createBuffer();
    this.enabled = true;

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texCoordBuffer);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array([0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0]),
      this.gl.STATIC_DRAW
    );

    this.aLocs = {};
    this.aLocs.position = this.gl.getAttribLocation(
      this.shader,
      'aVertexPosition'
    );

    this.aLocs.texCoord = this.gl.getAttribLocation(this.shader, 'aTexCoord');

    this.uLocs = {};
    this.uLocs.sampler = this.gl.getUniformLocation(this.shader, 'uSampler');

    this.gl.enableVertexAttribArray(this.aLocs.texCoord);
    this.gl.vertexAttribPointer(
      this.aLocs.texCoord,
      2,
      this.gl.FLOAT,
      false,
      0,
      0
    );

    // Create a texture.
    this.texture = this.gl.createTexture();
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);

    // Set the parameters so we can render any size image.
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_WRAP_S,
      this.gl.CLAMP_TO_EDGE
    );
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_WRAP_T,
      this.gl.CLAMP_TO_EDGE
    );
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_MIN_FILTER,
      this.gl.NEAREST
    );
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_MAG_FILTER,
      this.gl.NEAREST
    );

    this.updateCorners(corners);
    this.updateAsset(asset);
  }

  updateAsset(path) {
    console.log(path);
    if (imageFormats.some(ext => path.endsWith(ext))) {
      // Image format
    } else if (videoFormats.some(ext => path.endsWith(ext))) {
      // Video format
    } else {
      // Asset is null
    }

    var image = new Image();
    image.src = '/assets/kitten.jpeg';
    image.addEventListener('load', () => {
      console.log('image loaded');
      this.gl.texImage2D(
        this.gl.TEXTURE_2D,
        0,
        this.gl.RGBA,
        this.gl.RGBA,
        this.gl.UNSIGNED_BYTE,
        image
      );
    });
  }

  updateCorners(corners) {
    const positions = unpackCorners(corners);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(positions),
      this.gl.STATIC_DRAW
    );
  }

  render() {
    if (!this.enabled) return;
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
    this.gl.vertexAttribPointer(
      this.aLocs.position,
      2,
      this.gl.FLOAT,
      false,
      0,
      0
    );
    this.gl.enableVertexAttribArray(this.aLocs.position);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texCoordBuffer);
    this.gl.vertexAttribPointer(
      this.aLocs.texCoord,
      2,
      this.gl.FLOAT,
      false,
      0,
      0
    );
    this.gl.enableVertexAttribArray(this.aLocs.texCoord);

    // Tell WebGL we want to affect texture unit 0
    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
    this.gl.uniform1i(this.uLocs.sampler, 0);

    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
  }

  dispose() {}
}

window.addEventListener('load', main);
