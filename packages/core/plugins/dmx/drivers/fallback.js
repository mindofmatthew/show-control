class DMXFallback {
  constructor() {
    console.log('No DMX device connected. Printing data to console instead.');
  }

  close() {}

  jumpTo(state = {}) {
    console.log('Setting DMX lights:');
    console.log(JSON.stringify(state, null, 2));
  }

  animateTo(state) {}
}

module.exports = { DMXFallback };
