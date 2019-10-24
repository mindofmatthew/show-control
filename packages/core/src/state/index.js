const { produce } = require('immer');

const config = require('./config');
const cues = require('./cues');

exports.mutate = (state, action) =>
  produce(state, draft => {
    switch (action.type) {
      case 'CHANGE_TITLE':
        draft.title = action.value;
        return;
      case 'SET_CURRENT_CUE':
        draft.volatile.currentCue = action.id;
        return;
      case 'DELETE_CUE':
        if (draft.volatile.currentCue === action.id) {
          draft.volatile.currentCue = null;
        }
        cues.mutate(draft.cues, action);
        return;
      default:
        config.mutate(draft.config, action);
        cues.mutate(draft.cues, action);
        return;
    }
  });
