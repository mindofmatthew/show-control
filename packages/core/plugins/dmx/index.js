const SerialPort = require('serialport');

SerialPort.list().then(info => console.log(JSON.stringify(info, null, 2)));

// const DMX = require('dmx');

// let dmx = null;
//
// try {
//   let newDmx = new DMX();
//   newDmx.addUniverse('main', 'enttec-usb-dmx-pro', '');
//   dmx = newDmx;
// } catch (error) {
//   console.log('DMX controller not found');
// }

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
