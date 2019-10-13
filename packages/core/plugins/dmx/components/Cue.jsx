import React from 'react';

export function Cue({ config, data, dispatch }) {
  return (
    <div className="cue-config">
      <h3>DMX</h3>
      {config.lights.length === 0 ? (
        <p>No lights set up yet...</p>
      ) : (
        <>
          <ul>
            {config.lights.map(l => (
              <LightCue
                key={l.id}
                id={l.id}
                light={config.lights.find(o => o.id === l.id)}
                enabled={l.id in data.lights}
                value={data.lights[l.id]}
                dispatch={dispatch}
              />
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

function LightCue({ id, light, enabled, value, dispatch }) {
  return (
    <li>
      <label>
        <input
          type="checkbox"
          checked={enabled}
          onChange={({ target: { checked } }) => {
            console.log(checked);
            if (checked) {
              dispatch({ type: 'ADD_LIGHT_CUE', id });
            } else {
              dispatch({ type: 'DELETE_LIGHT_CUE', id });
            }
          }}
        />
        {light.name}
      </label>
      {enabled ? (
        <input
          type={light.type === 'white' ? 'range' : 'color'}
          min="0"
          max="255"
          value={value}
          onChange={({ target: { value } }) => {
            dispatch({
              type: 'EDIT_LIGHT_CUE',
              id,
              value
            });
          }}
        />
      ) : null}
    </li>
  );
}
