import React from 'react';

export function Cue({ editing, data, dispatch }) {
  if (!editing) {
    return data.length > 0 ? (
      <div>
        <h3>Audio</h3>
        <ul>{JSON.stringify(data)}</ul>
      </div>
    ) : null;
  }

  return (
    <div>
      <h3>Audio</h3>

      <ul>
        {data.map(c => (
          <li key={c.id}>
            Asset:
            <input
              value={c.asset}
              onChange={({ target: { value } }) => {
                dispatch({
                  type: 'EDIT_CUE_ASSET',
                  id: c.id,
                  value
                });
              }}
            />
            <br />
            Attack:
            <input
              type="number"
              value={c.attack}
              onChange={({ target: { value } }) => {
                dispatch({
                  type: 'EDIT_CUE_ATTACK',
                  id: c.id,
                  value
                });
              }}
            />
            Release:
            <input
              type="number"
              value={c.release}
              onChange={({ target: { value } }) => {
                dispatch({
                  type: 'EDIT_CUE_RELEASE',
                  id: c.id,
                  value
                });
              }}
            />
            <br />
            <button
              onClick={() => {
                dispatch({ type: 'DELETE_CUE', id: c.id });
              }}>
              Delete
            </button>
          </li>
        ))}
        <button
          onClick={() => {
            dispatch({ type: 'ADD_CUE' });
          }}>
          Add Audio
        </button>
      </ul>
    </div>
  );
}
