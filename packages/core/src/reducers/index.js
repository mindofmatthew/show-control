const config = require('./config');
const cues = require('./cues');

exports.reducer = (state, action) => {
  switch (action.type) {
    case 'CHANGE_TITLE':
      return { ...state, title: action.value };
    default:
      return {
        title: state.title,
        config: config.reducer(state.config, action),
        cues: cues.reducer(state.cues, action)
      };
  }
};
