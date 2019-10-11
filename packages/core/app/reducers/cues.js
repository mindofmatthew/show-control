import { ACTION_TYPE, ACTION_PLUGIN } from './symbols';
import { cueReducer as dmxCueReducer } from '../../dmx/reducers/cue';
import { genId } from '../../common';

export const defaultCueList = [];

export function cueListReducer(state, action) {
  const { [ACTION_PLUGIN]: plugin } = action;
  switch (action[ACTION_TYPE]) {
    case 'ADD_CUE':
      return [...state, { id: genId(), name: '', data: { dmx: null } }];
    case 'DELETE_CUE':
      return state.filter(cue => cue.id !== action.id);
    case 'EDIT_CUE_DATA':
      switch (plugin) {
        case 'dmx':
          const newDMX = dmxCueReducer(state.dmx, actionData);
          return state.dmx === newDMX ? state : { ...state, dmx: newDMX };
      }
  }

  return state;
}
