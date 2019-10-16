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
      case 'DELETE':
        delete projections[action.id];
        break;
      case 'EDIT':
        projections[action.projection.id].update(action.projection.corners);
        break;
    }

    render();
  });

  render();

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
  constructor(context, shaderProgram, image) {
    this.gl = context;
    this.shader = shaderProgram;
    this.buffer = this.gl.createBuffer();
    this.texCoordBuffer = this.gl.createBuffer();

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texCoordBuffer);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array([
        0.0,
        0.0,
        1.0,
        0.0,
        0.0,
        1.0,
        0.0,
        1.0,
        1.0,
        0.0,
        1.0,
        1.0
      ]),
      this.gl.STATIC_DRAW
    );

    this.aLocs = {};
    this.aLocs.position = this.gl.getAttribLocation(
      this.shader,
      'aVertexPosition'
    );

    this.aLocs.texCoord = this.gl.getAttribLocation(this.shader, 'aTexCoord');

    // function render(image) {
    //   var texCoordLocation = gl.getAttribLocation(program, 'a_texCoord');
    //
    //   // provide texture coordinates for the rectangle.
    //   var texCoordBuffer = gl.createBuffer();
    //
    //   gl.enableVertexAttribArray(texCoordLocation);
    //   gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);
    //
    //   // Create a texture.
    //   var texture = gl.createTexture();
    //   gl.bindTexture(gl.TEXTURE_2D, texture);
    //
    //   // Set the parameters so we can render any size image.
    //   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    //   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    //   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    //   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    //
    //   // Upload the image into the texture.
    //   gl.texImage2D(
    //     gl.TEXTURE_2D,
    //     0,
    //     gl.RGBA,
    //     gl.RGBA,
    //     gl.UNSIGNED_BYTE,
    //     image
    //   );
    // }
  }

  enable() {}

  updateImage(path) {
    var image = new Image();
    image.src = '/assets/kitten.jpeg';
    image.onload = () => {
      console.log('loaded');
      this.render();
    };
  }

  update(corners) {
    const positions = unpackCorners(corners);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(positions),
      this.gl.STATIC_DRAW
    );
  }

  render() {
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

    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
  }

  disable() {}

  dispose() {}
}

window.addEventListener('load', main);
