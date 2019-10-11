const plugins = {};

plugins.dmx = require('../../plugins/dmx/reducers/global');

exports.reducer = (state, action) => {
  switch (action.type) {
    case 'EDIT_PLUGIN':
      state[action.plugin] = plugins[action.plugin].reducer(
        state[action.plugin],
        action.action
      );
      return state;
  }

  return state;
};
