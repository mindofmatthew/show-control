import React, { useState, useEffect, useRef } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

import { Cue as DMXCue } from '../../../plugins/dmx/components/Cue';
import { Cue as ProjectionCue } from '../../../plugins/projection/components/Cue';

export function Cue({
  config,
  dispatch,
  cue: { id, name, data },
  locked,
  current
}) {
  let [editing, setEditing] = useState(false);

  useEffect(() => {
    if (locked) {
      setEditing(false);
    }
  }, [locked, setEditing]);

  const ref = useRef(null);

  return (
    <li
      className={['cue', current ? 'current' : ''].join(' ')}
      onClick={() => {
        dispatch({ type: 'SET_CURRENT_CUE', id });
      }}>
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
            onClick={e => {
              dispatch({ type: 'DELETE_CUE', id });
              e.stopPropagation();
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
        <ProjectionCue
          editing={editing}
          config={config.projection}
          data={data.projection}
          dispatch={action => {
            dispatch({
              type: 'EDIT_CUE_PLUGIN',
              plugin: 'projection',
              action,
              id
            });
          }}
        />
      </div>
    </li>
  );
}
