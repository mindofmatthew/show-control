import React from 'react';

export function Header({ saved, editable, onEditableUpdate, title, dispatch }) {
  return (
    <header>
      <h1>{title}</h1>
      <i>{saved ? 'Saved' : 'Saving...'}</i>
    </header>
  );
}
