import React from 'react';

import { ACTION_TYPE, ACTION_PLUGIN } from '../../reducers/symbols';

import { Config as DMXConfig } from '../../../dmx/components/Config';

export function Config({ config, dispatch }) {
  function dmxDispatch(action) {
    dispatch({
      [ACTION_TYPE]: 'EDIT_PLUGIN_CONFIG',
      [ACTION_PLUGIN]: 'dmx',
      ...action
    });
  }

  return (
    <section className="configuration">
      <h2>Configuration</h2>
      <section>
        <h3>DMX</h3>
        <DMXConfig {...config.dmx} dispatch={dmxDispatch} />
      </section>
    </section>
  );
}
