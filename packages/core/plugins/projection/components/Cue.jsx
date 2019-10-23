import React from 'react';

export function Cue({ editing, data, dispatch }) {
  if (!editing) {
    return (
      <div>
        <h3>Projection</h3>
        <ul>
          {data.map(c => (
            <li>
              {c.asset} @ {JSON.stringify(c.corners)}
            </li>
          ))}
        </ul>
      </div>
    );
  }
  return (
    <div>
      <h3>Projection</h3>

      <ul>
        {data.map(c => (
          <li key={c.id}>
            <CornerPicker
              value={c.corners}
              onChange={corners => {
                dispatch({
                  type: 'EDIT_CUE_CORNERS',
                  id: c.id,
                  corners
                });
              }}
              maxX={1}
              maxY={1}
            />
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
          Add Projection
        </button>
      </ul>
    </div>
  );
}

function CornerPicker({ value, onChange, ...config }) {
  return (
    <div className="corner-picker">
      <Thumb
        value={value.northwest}
        onChange={v => onChange({ ...value, northwest: v })}
        {...config}
      />
      <Thumb
        value={value.northeast}
        onChange={v => onChange({ ...value, northeast: v })}
        {...config}
      />
      <Thumb
        value={value.southwest}
        onChange={v => onChange({ ...value, southwest: v })}
        {...config}
      />
      <Thumb
        value={value.southeast}
        onChange={v => onChange({ ...value, southeast: v })}
        {...config}
      />
    </div>
  );
}

function Thumb({ value: { x, y }, onChange, maxX, maxY }) {
  return (
    <div
      className="corner-picker-thumb"
      tabIndex="0"
      style={{
        left: (x / maxX) * 100 - 5,
        top: (y / maxY) * 100 - 5
      }}
      onKeyDown={e => {
        let delta = 0.001;
        if (e.shiftKey) delta = 0.01;
        switch (e.key) {
          case 'ArrowLeft':
            onChange({ x: x - delta, y });
            break;
          case 'ArrowRight':
            onChange({ x: x + delta, y });
            break;
          case 'ArrowUp':
            onChange({ x, y: y - delta });
            break;
          case 'ArrowDown':
            onChange({ x, y: y + delta });
            break;
        }
      }}
      onPointerDown={e => {
        e.target.setPointerCapture(e.pointerId);
      }}
      onPointerUp={e => {
        e.target.releasePointerCapture(e.pointerId);
      }}
      onPointerMove={e => {
        if (!e.target.hasPointerCapture(e.pointerId)) return;
        const { left, top } = e.target.parentElement.getBoundingClientRect();
        const screenX = e.clientX - left - 5;
        const screenY = e.clientY - top - 5;
        onChange({
          x: (screenX / 100) * maxX,
          y: (screenY / 100) * maxY
        });
      }}></div>
  );
}
