const { genId } = require('../../../common');

exports.empty = [];

const defaultCueData = {
  asset: '',
  attack: 0,
  release: 0
};

exports.mutate = (draft, action) => {
  switch (action.type) {
    case 'DELETE_CUE':
      draft.splice(draft.findIndex(cue => cue.id === action.id), 1);
      return;
    case 'ADD_CUE':
      const newCue = { id: genId(), ...defaultCueData };
      draft.push(newCue);
      return;
    case 'EDIT_CUE_ASSET':
      draft.find(c => c.id === action.id).asset = action.value;
      return;
    case 'EDIT_CUE_ATTACK':
      draft.find(c => c.id === action.id).attack = action.value;
      return;
    case 'EDIT_CUE_RELEASE':
      draft.find(c => c.id === action.id).release = action.value;
      return;
  }
};
