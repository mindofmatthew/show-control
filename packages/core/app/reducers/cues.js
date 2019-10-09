import { ACTION_TYPE, ACTION_PLUGIN } from './symbols';

export const defaultCueList = [];

let id = 0;

export function cueListReducer(state, action) {
  switch (action[ACTION_TYPE]) {
    case 'ADD_CUE':
      return [...state, { id: id++, name: '', data: { dmx: null } }];
    case 'DELETE_CUE':
      return state.filter(cue => cue.id !== action.id);
  }

  return state;
}
