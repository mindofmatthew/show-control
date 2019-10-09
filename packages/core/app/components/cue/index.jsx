import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

import { ACTION_TYPE } from '../../reducers/symbols';

export function Cue({ dispatch, cue: { id, name, data } }) {
  return (
    <li className="cue">
      <div className="controls">
        <button>
          <FontAwesomeIcon icon={faEdit} />
        </button>
        <button
          onClick={() => {
            dispatch({ [ACTION_TYPE]: 'DELETE_CUE', id });
          }}>
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
      <div className="data-type">
        <h3>DMX</h3>
      </div>
    </li>
  );
}
