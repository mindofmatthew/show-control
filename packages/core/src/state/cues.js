const { genId } = require('../../common');

const plugins = {};

plugins.dmx = require('../../plugins/dmx/state/cue');
plugins.projection = require('../../plugins/projection/state/cue');

const emptyData = {};

for (let plugin in plugins) {
  emptyData[plugin] = plugins[plugin].empty;
}

exports.mutate = (draft, action) => {
  switch (action.type) {
    case 'ADD_CUE':
      draft.push({ id: genId(), name: '', data: emptyData });
      return;
    case 'DELETE_CUE':
      draft.splice(draft.findIndex(cue => cue.id === action.id), 1);
      return;
    case 'EDIT_PLUGIN':
      draft.forEach(cue => {
        mutateCue(cue, action);
      });
      return;
    case 'EDIT_CUE_PLUGIN':
      draft.forEach(cue => {
        if (cue.id === action.id) {
          mutateCue(cue, action);
        }
      });
  }
};

function mutateCue(draft, action) {
  switch (action.type) {
    case 'EDIT_PLUGIN':
    case 'EDIT_CUE_PLUGIN':
      plugins[action.plugin].mutate(draft.data[action.plugin], action.action);
      return;
  }
}
