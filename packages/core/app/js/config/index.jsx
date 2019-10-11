import React from 'react';

import { Config as DMXConfig } from '../../../plugins/dmx/components/Config';

export function Config({ config, dispatch }) {
  return (
    <section className="configuration">
      <h2>Configuration</h2>
      <section>
        <h3>DMX</h3>
        <DMXConfig
          {...config.dmx}
          dispatch={action =>
            dispatch({ type: 'EDIT_PLUGIN', plugin: 'dmx', action })
          }
        />
      </section>
    </section>
  );
}
