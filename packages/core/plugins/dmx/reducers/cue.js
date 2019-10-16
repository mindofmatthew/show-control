exports.empty = {
  lights: {}
};

exports.reducer = (state, action) => {
  const lights = { ...state.lights };
  switch (action.type) {
    case 'CHANGE_LIGHT_TYPE':
      lights[action.id] = defaultForType(action.value);
      return { ...state, lights };
    case 'DELETE_LIGHT_CUE':
      delete lights[action.id];
      return { ...state, lights };
    case 'ADD_LIGHT_CUE':
      lights[action.id] = defaultForType(action.lightType);
      return { ...state, lights };
    case 'EDIT_LIGHT_CUE':
      lights[action.id] = action.value;
      return { ...state, lights };
  }
  return state;
};

function defaultForType(lightType) {
  switch (lightType) {
    case 'rgb':
      return '#000000';
    case 'white':
      return 0;
    default:
      throw new Error(`Unexpected light lightType "${lightType}"`);
  }
}
