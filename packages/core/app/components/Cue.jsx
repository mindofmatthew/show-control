import React from 'react';

import { ACTION_TYPE } from '../reducers/symbols';

export function Cue({ dispatch, cue: { id, name, data } }) {
  return (
    <li className="cue">
      <div className="controls">
        <button
          onClick={() => {
            dispatch({ [ACTION_TYPE]: 'DELETE_CUE', id });
          }}>
          Delete
        </button>
      </div>
      {id}
    </li>
  );
}
