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
          projections[projection.id] = new Projection(context, shaderProgram);
          projections[projection.id].update(projection.corners);
        }
        break;
      case 'REMOVE':
        break;
      case 'EDIT_POINTS':
        break;
    }

    render();
  });

  function render() {
    context.clear(context.COLOR_BUFFER_BIT);
    context.useProgram(shaderProgram);

    for (let id in projections) {
      projections[id].render();
    }
  }
}

function unpackCorners({ northwest, northeast, southwest, southeast }) {
  return [
    northwest.x / 1024,
    northwest.y / 768,
    northeast.x / 1024,
    northeast.y / 768,
    southwest.x / 1024,
    southwest.y / 768,
    southeast.x / 1024,
    southeast.y / 768
  ];
}

class Projection {
  constructor(context, shaderProgram) {
    this.context = context;
    this.shader = shaderProgram;
    this.buffer = this.context.createBuffer();

    this.attribute = this.context.getAttribLocation(
      this.shader,
      'aVertexPosition'
    );
  }

  enable() {}

  update(corners) {
    const positions = unpackCorners(corners);
    this.context.bindBuffer(this.context.ARRAY_BUFFER, this.buffer);
    this.context.bufferData(
      this.context.ARRAY_BUFFER,
      new Float32Array(positions),
      this.context.STATIC_DRAW
    );
  }

  render() {
    this.context.bindBuffer(this.context.ARRAY_BUFFER, this.buffer);
    this.context.vertexAttribPointer(
      this.attribute,
      2,
      this.context.FLOAT,
      false,
      0,
      0
    );
    this.context.enableVertexAttribArray(this.attribute);

    this.context.drawArrays(this.context.TRIANGLE_STRIP, 0, 4);
  }

  disable() {}

  dispose() {}
}

window.addEventListener('load', main);
