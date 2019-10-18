const plugins = {};

plugins.dmx = require('../../plugins/dmx/state/global');

exports.mutate = (draft, action) => {
  switch (action.type) {
    case 'EDIT_PLUGIN':
      plugins[action.plugin].mutate(draft[action.plugin], action.action);
      return;
  }
};
