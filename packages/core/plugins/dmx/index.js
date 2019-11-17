// const { EnttecUSBDMXPRO: DMX } = require('./drivers/enttec-dmx-usb-pro.js');
const { DMXFallback } = require('./drivers/fallback.js');

// TODO: This code is basically what I want, but it doesn't work right if
// the serial device is not connected, because it fails in a promise that
// resolves after the try/catch block.
//
// let dmx;
//
// try {
//   dmx = new DMX('/dev/tty.usbserial-EN272481');
// } catch (error) {
//   console.log('error connecting to DMX');
//   dmx = new DMXFallback();
// }

// TODO: This is a placeholder that works without the serial device
let dmx = new DMXFallback();

let previous;

exports.update = state => {
  if (!previous || state.volatile.currentCue !== previous.volatile.currentCue) {
    if (state.volatile.currentCue === null) {
      dmx.jumpTo();
    } else {
      let cue = state.cues.find(c => c.id === state.volatile.currentCue);
      let channels = getChannels(cue.data.dmx.lights, state.config.dmx.lights);
      dmx.jumpTo(channels);
    }
  } else if (state.volatile.currentCue !== null) {
    let cue = state.cues.find(c => c.id === state.volatile.currentCue);
    let lastCue = previous.cues.find(c => c.id === state.volatile.currentCue);

    if (state.config.dmx !== previous.config.dmx || cue !== lastCue) {
      let channels = getChannels(cue.data.dmx.lights, state.config.dmx.lights);
      dmx.jumpTo(channels);
    }
  }

  previous = state;
};

function getChannels(values, lights) {
  let channels = {};

  for (let id in values) {
    let light = lights.find(l => l.id === id);

    if (light.type === 'white') {
      channels[light.channel] = values[id];
    } else if (light.type === 'rgb') {
      let color = parseInt(values[id].substring(1), 16);
      channels[light.channel] = (color >> 16) & 0xff; // R
      channels[light.channel + 1] = (color >> 8) & 0xff; // G
      channels[light.channel + 2] = color & 0xff; // B
    }
  }

  return channels;
}
