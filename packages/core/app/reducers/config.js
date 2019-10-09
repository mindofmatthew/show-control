import {
  configReducer as dmxConfigReducer,
  defaultConfig as dmxDefaultConfig
} from '../../dmx/reducers/config';

import { ACTION_TYPE, ACTION_PLUGIN } from './symbols';

export const defaultConfig = {
  dmx: dmxDefaultConfig
};

export function configReducer(state, action) {
  if (action[ACTION_TYPE] === 'EDIT_PLUGIN_CONFIG') {
    let {
      [ACTION_TYPE]: type,
      [ACTION_PLUGIN]: plugin,
      ...actionData
    } = action;

    switch (plugin) {
      case 'dmx':
        const newDMX = dmxConfigReducer(state.dmx, actionData);
        return state.dmx === newDMX ? state : { ...state, dmx: newDMX };
    }
  }

  return state;
}
