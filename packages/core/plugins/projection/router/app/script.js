async function main() {
  //Set up websocket
  const ws = new WebSocket(`ws:${location.host}/plugins/projection/_/feed`);
  ws.addEventListener('message', e => {
    console.log(e.data);
  });

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

  // Get position attribute location
  const attrLocation = context.getAttribLocation(
    shaderProgram,
    'aVertexPosition'
  );

  // Create a buffer of position data
  const positionBuffer = context.createBuffer();
  context.bindBuffer(context.ARRAY_BUFFER, positionBuffer);

  const positions = [-0.5, 0.5, 0.5, 0.5, -0.5, -0.5, 0.5, -0.5];
  context.bufferData(
    context.ARRAY_BUFFER,
    new Float32Array(positions),
    context.STATIC_DRAW
  );

  // Render
  context.clear(context.COLOR_BUFFER_BIT);

  context.bindBuffer(context.ARRAY_BUFFER, positionBuffer);
  context.vertexAttribPointer(attrLocation, 2, context.FLOAT, false, 0, 0);
  context.enableVertexAttribArray(attrLocation);

  context.useProgram(shaderProgram);
  context.drawArrays(context.TRIANGLE_STRIP, 0, 4);
}

class Video {
  constructor() {}

  enable() {}

  update() {}

  disable() {}

  dispose() {}
}

window.addEventListener('load', main);
