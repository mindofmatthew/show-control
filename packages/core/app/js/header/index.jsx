import React from 'react';

export function Header({ editable, onEditableUpdate, title, dispatch }) {
  return (
    <header>
      <h1>{title}</h1>
    </header>
  );
}
