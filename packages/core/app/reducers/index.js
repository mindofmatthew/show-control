import { configReducer, defaultConfig } from './config';
import { cueListReducer, defaultCueList } from './cues';

export const defaultState = {
  config: defaultConfig,
  cues: defaultCueList
};

export function reducer(state, action) {
  let newState = state;

  // Configuration
  let newConfig = configReducer(state.config, action);

  if (state.config !== newConfig) {
    newState = { ...state, config: newConfig };
  }

  // Cue list
  let newCueList = cueListReducer(state.cues, action);

  if (state.cues !== newCueList) {
    newState = { ...state, cues: newCueList };
  }

  return newState;
}
