import React from 'react';

export function Cue({ editing, config, data, dispatch }) {
  if (!editing) {
    return Object.keys(data.lights).length > 0 ? (
      <div className="cue-config">
        <h3>DMX</h3>
        <ul>
          {config.lights
            .filter(l => l.id in data.lights)
            .map(l => (
              <li>
                {l.name}: {data.lights[l.id]}
              </li>
            ))}
        </ul>
      </div>
    ) : null;
  }

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
                light={l}
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

function LightCue({ light: { id, name, type }, enabled, value, dispatch }) {
  return (
    <li>
      <label>
        <input
          type="checkbox"
          checked={enabled}
          onChange={({ target: { checked } }) => {
            if (checked) {
              dispatch({ type: 'ADD_LIGHT_CUE', id, lightType: type });
            } else {
              dispatch({ type: 'DELETE_LIGHT_CUE', id });
            }
          }}
        />
        {name}
      </label>
      {enabled ? (
        <input
          type={type === 'white' ? 'range' : 'color'}
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
