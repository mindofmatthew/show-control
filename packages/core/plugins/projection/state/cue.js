const { genId } = require('../../../common');
const { addCue, editCue, deleteCue } = require('../router');

exports.empty = [];

const defaultCueData = {
  asset: '',
  corners: {
    northwest: { x: 0, y: 0 },
    northeast: { x: 1, y: 0 },
    southwest: { x: 0, y: 1 },
    southeast: { x: 1, y: 1 }
  }
};

exports.mutate = (draft, action) => {
  switch (action.type) {
    case 'DELETE_CUE':
      deleteCue(action.id);
      draft.splice(draft.findIndex(cue => cue.id === action.id), 1);
      return;
    case 'ADD_CUE':
      const newCue = { id: genId(), ...defaultCueData };
      addCue(newCue);
      draft.push(newCue);
      return;
    case 'EDIT_CUE':
      console.log(action.data);
      editCue(action.data);
      draft[draft.findIndex(cue => cue.id === action.id)].data = action.data;
      return;
  }
};
