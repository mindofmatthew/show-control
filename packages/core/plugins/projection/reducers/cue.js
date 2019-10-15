const { genId } = require('../../../common');
const { addCue, editCue, deleteCue } = require('../router');

exports.empty = [];

exports.reducer = (state, action) => {
  switch (action.type) {
    case 'DELETE_CUE':
      deleteCue(action.id);
      return state.filter(cue => cue.id !== action.id);
    case 'ADD_CUE':
      const newCue = {
        id: genId(),
        asset: 'foo/bar/baz.webm',
        corners: {
          northwest: { x: 0, y: 0 },
          northeast: { x: 1, y: 0 },
          southwest: { x: 0, y: 1 },
          southeast: { x: 1, y: 1 }
        }
      };

      addCue(newCue);
      return [...state, newCue];
    case 'EDIT_CUE':
      editCue(action.data);
      return state.map(cue => (cue.id === action.id ? action.data : cue));
  }
  return state;
};
