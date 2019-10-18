exports.empty = {
  lights: {}
};

exports.mutate = (draft, action) => {
  switch (action.type) {
    case 'CHANGE_LIGHT_TYPE':
      draft.lights[action.id] = defaultForType(action.value);
      return;
    case 'DELETE_LIGHT_CUE':
      delete draft.lights[action.id];
      return;
    case 'ADD_LIGHT_CUE':
      draft.lights[action.id] = defaultForType(action.lightType);
      return;
    case 'EDIT_LIGHT_CUE':
      draft.lights[action.id] = action.value;
      return;
  }
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
