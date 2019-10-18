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
                  type: 'EDIT_CUE',
                  id: c.id,
                  data: { ...c, corners }
                });
              }}
              maxX={1}
              maxY={1}
            />
            <input
              value={c.asset}
              onChange={({ target: { value } }) => {
                dispatch({
                  type: 'EDIT_CUE',
                  id: c.id,
                  data: { ...c, asset: value }
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
    <div
      style={{
        width: 100,
        height: 100,
        border: 'solid #eee 5px',
        background: 'lightgray',
        position: 'relative'
      }}>
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
      tabIndex="0"
      style={{
        width: 10,
        height: 10,
        background: 'gray',
        position: 'absolute',
        left: (x / maxX) * 100 - 5,
        top: (y / maxY) * 100 - 5,
        fontSize: 10,
        borderRadius: 3
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
        const screenX = e.clientX - e.target.parentElement.offsetLeft - 5;
        const screenY = e.clientY - e.target.parentElement.offsetTop - 5;
        onChange({
          x: (screenX / 100) * maxX,
          y: (screenY / 100) * maxY
        });
      }}></div>
  );
}
