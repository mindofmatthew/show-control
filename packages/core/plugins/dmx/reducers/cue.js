const { genId } = require('../../../common');

exports.empty = {
  lights: []
};

exports.reducer = (state, action) => {
  switch (action.type) {
    // case 'CHANGE_TYPE':
    //   return {
    //     ...state,
    //     lights: state.lights.map(light =>
    //       light.id === action.id ? { ...light, type: action.value } : light
    //     )
    //   };
    case 'DELETE_LIGHT':
      return {
        ...state,
        lights: state.lights.filter(light => light.id !== action.id)
      };
    case 'ADD_LIGHT_CUE':
      return {
        ...state,
        lights: [
          ...lights,
          { id: genId, lightId: action.lightId, value: action.value }
        ]
      };
  }
};
