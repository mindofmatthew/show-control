exports.empty = {
  lights: {}
};

exports.reducer = (state, action) => {
  const lights = { ...state.lights };
  switch (action.type) {
    // case 'CHANGE_TYPE':
    //   return {
    //     ...state,
    //     lights: state.lights.map(light =>
    //       light.id === action.id ? { ...light, type: action.value } : light
    //     )
    //   };
    case 'DELETE_LIGHT':
      delete lights[action.id];
      return { ...state, lights };
    case 'ADD_LIGHT_CUE':
      lights[action.id] = action.value;
      return { ...state, lights };
    case 'EDIT_LIGHT_CUE':
      lights[action.id] = action.value;
      return { ...state, lights };
  }
  return state;
};
