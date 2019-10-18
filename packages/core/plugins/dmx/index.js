const { EnttecUSBDMXPRO: DMX } = require('./drivers/enttec-dmx-usb-pro.js');
const { DMXFallback } = require('./drivers/fallback.js');

let dmx = new DMXFallback();

// try {
//   dmx = new DMX('/dev/tty.usbserial-EN272481');
// } catch (error) {
//   console.log('error connecting to DMX');
//   dmx = new DMXFallback();
// }

let previous;

exports.update = state => {
  if (!previous || state.volatile.currentCue !== previous.volatile.currentCue) {
    if (state.volatile.currentCue === null) {
      dmx.jumpTo();
    } else {
      let cue = state.cues.find(c => c.id === state.volatile.currentCue);
      console.log(cue.data.dmx);
    }
  } else {
  }

  previous = state;
};
