import React from 'react';

export function Config({ lights, dispatch }) {
  return (
    <>
      <ul>
        {lights.map(light => (
          <LightConfig key={light.id} dispatch={dispatch} {...light} />
        ))}
      </ul>
      <button
        onClick={() => {
          dispatch({ type: 'ADD_LIGHT' });
        }}>
        Add Light
      </button>
    </>
  );
}

function LightConfig({ id, name, channel, type, dispatch }) {
  return (
    <li>
      <input
        type="text"
        value={name}
        onChange={({ target: { value } }) => {
          dispatch({ type: 'CHANGE_LIGHT_NAME', id, value });
        }}
      />
      <input
        type="number"
        min="0"
        max="511"
        value={channel}
        onChange={({ target: { value } }) => {
          dispatch({
            type: 'CHANGE_LIGHT_CHANNEL',
            id,
            value: parseInt(value)
          });
        }}
      />
      <select
        value={type}
        onChange={({ target: { value } }) => {
          dispatch({ type: 'CHANGE_LIGHT_TYPE', id, value });
        }}>
        <option value="white">White (1 channel)</option>
        <option value="rgb">RGB (3 channels)</option>
      </select>
      <button
        onClick={() => {
          dispatch({ type: 'DELETE_LIGHT', id });
        }}>
        &times;
      </button>
    </li>
  );
}
