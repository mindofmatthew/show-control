const { genId } = require('../../../common');

const defaultLightData = { name: 'dmx1', channel: 0, type: 'white' };

exports.mutate = ({ lights }, action) => {
  switch (action.type) {
    case 'ADD_LIGHT':
      lights.push({ id: genId(), ...defaultLightData });
      return;
    case 'CHANGE_LIGHT_NAME':
      lights[lights.findIndex(l => l.id === action.id)].name = action.value;
      return;
    case 'CHANGE_LIGHT_CHANNEL':
      lights[lights.findIndex(l => l.id === action.id)].channel = action.value;
      return;
    case 'CHANGE_LIGHT_TYPE':
      lights[lights.findIndex(l => l.id === action.id)].type = action.value;
      return;
    case 'DELETE_LIGHT':
      lights.splice(lights.findIndex(l => l.id === action.id), 1);
      return;
  }
};
