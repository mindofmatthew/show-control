import React, { useState, useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

import { Cue as DMXCue } from '../../../plugins/dmx/components/Cue';

export function Cue({ config, dispatch, cue: { id, name, data }, locked }) {
  let [editing, setEditing] = useState(false);

  useEffect(() => {
    if (locked) {
      setEditing(false);
    }
  }, [locked, setEditing]);

  return (
    <li className="cue">
      <div className="header">
        <h3>Cue Title</h3>
        <div className="controls">
          <button
            className={editing ? 'active' : ''}
            onClick={() => {
              setEditing(!editing);
            }}>
            <FontAwesomeIcon icon={faEdit} />
          </button>
          <button
            onClick={() => {
              dispatch({ type: 'DELETE_CUE', id });
            }}>
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      </div>
      <div className="data-type">
        <DMXCue
          editing={editing}
          config={config.dmx}
          data={data.dmx}
          dispatch={action => {
            dispatch({ type: 'EDIT_CUE_PLUGIN', plugin: 'dmx', action, id });
          }}
        />
      </div>
    </li>
  );
}
