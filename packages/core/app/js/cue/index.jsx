import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

import { Cue as DMXCue } from '../../../plugins/dmx/components/Cue';

export function Cue({ config, dispatch, cue: { id, name, data } }) {
  return (
    <li className="cue">
      <div className="controls">
        <button>
          <FontAwesomeIcon icon={faEdit} />
        </button>
        <button
          onClick={() => {
            dispatch({ type: 'DELETE_CUE', id });
          }}>
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
      <div className="data-type">
        <DMXCue
          config={config.dmx}
          data={data.dmx}
          dispatch={action =>
            dispatch({ type: 'EDIT_CUE_PLUGIN', plugin: dmx, action })
          }
        />
      </div>
    </li>
  );
}
