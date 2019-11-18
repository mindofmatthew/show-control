import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

import { Cue as DMXCue } from '../../../plugins/dmx/components/Cue';
import { Cue as ProjectionCue } from '../../../plugins/projection/components/Cue';
import { Cue as AudioCue } from '../../../plugins/audio/components/Cue';

export function Cue({
  dispatch,
  cue: { id, name, description, data },
  selected
}) {
    return (
      <tr className={['cue', selected ? 'current' : ''].join(' ')} onClick={() => {
        dispatch({ type: 'SET_CURRENT_CUE', id });
      }}><td></td><td>
      New Cue...
      <button
        onClick={e => {
          dispatch({ type: 'DELETE_CUE', id });
          e.stopPropagation();
        }}>
        <FontAwesomeIcon icon={faTrash} />
      </button>
      {/* <div className="header">
        <h3>
          {editing ? (
            <input
              value={name}
              onChange={e =>
                dispatch({ type: 'EDIT_CUE_NAME', id, name: e.target.value })
              }
            />
          ) : (
            name
          )}
        </h3>
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
      <p>
        {editing ? (
          <textarea
            value={description}
            onChange={e =>
              dispatch({
                type: 'EDIT_CUE_DESCRIPTION',
                id,
                description: e.target.value
              })
            }></textarea>
        ) : (
          description
        )}
      </p>
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
        <AudioCue
          editing={editing}
          config={config.audio}
          data={data.audio}
          dispatch={action => {
            dispatch({
              type: 'EDIT_CUE_PLUGIN',
              plugin: 'audio',
              action,
              id
            });
          }}
        />
      </div> */}
    </td></tr>
  );
}

export function CueList({ cues, dispatch }) {
  return <table>
    <thead><tr><th>#</th><th>Name</th></tr></thead>
    <tbody>{cues.map(cue => (
      <Cue
        key={cue.id}
        dispatch={dispatch}
        cue={cue}
      />
    ))}</tbody>
  </table>;
}
