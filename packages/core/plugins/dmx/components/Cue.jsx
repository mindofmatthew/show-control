import React from 'react';

export function Cue({ config, data, dispatch }) {
  return (
    <div>
      <h3>DMX</h3>
      {config.lights.length === 0 ? (
        <p>No lights set up yet...</p>
      ) : (
        <>
          <ul></ul>
          <button>Add light cue</button>
        </>
      )}
    </div>
  );
}
