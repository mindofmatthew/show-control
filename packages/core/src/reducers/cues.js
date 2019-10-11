const { genId } = require('../../common');

const plugins = {};

plugins.dmx = require('../../plugins/dmx/reducers/cue');

const emptyData = {};

for (let plugin in plugins) {
  emptyData[plugin] = plugins[plugin].empty;
}

exports.reducer = (state, action) => {
  switch (action.type) {
    case 'ADD_CUE':
      return [...state, { id: genId(), name: '', data: emptyData }];
    case 'DELETE_CUE':
      return state.filter(cue => cue.id !== action.id);
    case 'EDIT_PLUGIN':
      return state.map(cue => cueReducer(cue, action));
    case 'EDIT_CUE_PLUGIN':
      return state.map(cue =>
        cue.id === action.id ? cueReducer(cue, action) : cue
      );
  }

  return state;
};

function cueReducer(state, action) {
  switch (action.type) {
    case 'EDIT_PLUGIN':
    case 'EDIT_CUE_PLUGIN':
      return {
        ...state,
        data: {
          ...state.data,
          [action.plugin]: plugins[action.plugin].reducer(
            state.data[action.plugin],
            action.action
          )
        }
      };
  }

  return state;
}
