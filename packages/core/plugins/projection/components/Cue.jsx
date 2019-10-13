import React, { useState } from 'react';

export function Cue() {
  const [corners, setCorners] = useState({
    northwest: { x: 0, y: 0 },
    northeast: { x: 700, y: 0 },
    southwest: { x: 0, y: 700 },
    southeast: { x: 700, y: 700 }
  });
  return (
    <CornerPicker
      value={corners}
      onChange={v => {
        setCorners(v);
      }}
      maxX={1024}
      maxY={768}
    />
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
        let delta = 1;
        if (e.shiftKey) delta = 20;
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
          x: Math.round((screenX / 100) * maxX),
          y: Math.round((screenY / 100) * maxY)
        });
      }}>
      ({x},{y})
    </div>
  );
}
