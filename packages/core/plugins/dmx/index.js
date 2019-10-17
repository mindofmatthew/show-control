const { EnttecUSBDMXPRO: DMX } = require('./drivers/enttec-dmx-usb-pro.js');

let dmx;

try {
  dmx = new DMX('/dev/tty.usbserial-EN272481');
} catch (error) {
  console.log(error);
  console.log('Error accessing DMX device');
  dmx = null;
}

if (dmx) {
  dmx.updateAll(50);
  // XMLHTTPRequest
  // XmlHttpRequest
}

let currentCue;

exports.update = state => {
  if (state.volatile.currentCue !== currentCue) {
    if (currentCue === null) {
      console.log('setting dmx to black');
      // dmx.updateAll('main', 0);
    } else {
    }

    currentCue = state.volatile.currentCue;
  } else {
  }
};
