const config = require('./config');
const cues = require('./cues');

exports.reducer = (state, action) => {
  return {
    config: config.reducer(state.config, action),
    cues: cues.reducer(state.cues, action)
  };
};
