import React from 'react';

export function Cue({ config, data, dispatch }) {
  return (
    <div>
      <h3>DMX</h3>
      {config.lights.length === 0 ? (
        <p>No lights set up yet...</p>
      ) : (
        <>
          <ul>
            {config.lights
              .filter(l => l.id in data.lights)
              .map(l => (
                <LightCue
                  key={l.id}
                  id={l.id}
                  light={config.lights.find(o => (o.id = l.id))}
                  value={data.lights[l.id]}
                  dispatch={dispatch}></LightCue>
              ))}
          </ul>
          {config.lights.every(l => l.id in data.lights) || (
            <button
              onClick={() => {
                dispatch({
                  type: 'ADD_LIGHT_CUE',
                  id: config.lights[0].id,
                  value: 0
                });
              }}>
              Add light cue
            </button>
          )}
        </>
      )}
    </div>
  );
}

function LightCue({ id, light, value, dispatch }) {
  return (
    <li>
      {light.name}:&nbsp;
      <input
        value={value}
        onChange={({ target: { value } }) => {
          dispatch({
            type: 'EDIT_LIGHT_CUE',
            id,
            value
          });
        }}></input>
    </li>
  );
}
