export const defaultConfig = {
  lights: []
};

let id = 0;

export function configReducer(state, action) {
  switch (action.type) {
    case 'ADD_LIGHT':
      return {
        ...state,
        lights: [
          ...state.lights,
          { id: id++, name: 'dmx1', channel: 0, type: 'white' }
        ]
      };
    case 'CHANGE_NAME':
      return {
        ...state,
        lights: state.lights.map(light =>
          light.id === action.id ? { ...light, name: action.value } : light
        )
      };
    case 'CHANGE_CHANNEL':
      return {
        ...state,
        lights: state.lights.map(light =>
          light.id === action.id ? { ...light, channel: action.value } : light
        )
      };
    case 'CHANGE_TYPE':
      return {
        ...state,
        lights: state.lights.map(light =>
          light.id === action.id ? { ...light, type: action.value } : light
        )
      };
  }
}
