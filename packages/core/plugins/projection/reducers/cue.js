const { genId } = require('../../../common');
const { render } = require('../router');

exports.empty = [];

exports.reducer = (state, action) => {
  switch (action.type) {
    case 'DELETE_CUE':
      return state.filter(cue => cue.id !== action.id);
    case 'ADD_CUE':
      return [
        ...state,
        {
          id: genId(),
          asset: 'foo/bar/baz.webm',
          corners: {
            northwest: { x: 0, y: 0 },
            northeast: { x: 1024, y: 0 },
            southwest: { x: 0, y: 768 },
            southeast: { x: 1024, y: 768 }
          }
        }
      ];
    case 'EDIT_CUE':
      // TODO: move this to a better place
      render(action.data);
      return state.map(cue => (cue.id === action.id ? action.data : cue));
  }
  return state;
};
