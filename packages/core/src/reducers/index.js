const config = require('./config');
const cues = require('./cues');

exports.reducer = (state, action) => {
  switch (action.type) {
    case 'CHANGE_TITLE':
      return { ...state, title: action.value };
    case 'SET_CURRENT_CUE':
      return {
        ...state,
        volatile: { ...state.volatile, currentCue: action.id }
      };
    default:
      return {
        ...state,
        config: config.reducer(state.config, action),
        cues: cues.reducer(state.cues, action)
      };
  }
};
