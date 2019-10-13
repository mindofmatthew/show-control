import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLock,
  faUnlock,
  faSlidersH
} from '@fortawesome/free-solid-svg-icons';

export function Header({
  locked,
  onLockedUpdate,
  configuring,
  onConfiguringUpdate,
  title,
  dispatch
}) {
  return (
    <header className={configuring ? 'configuring' : ''}>
      <h1>{title}</h1>
      {!locked && (
        <button
          className={configuring ? 'active' : ''}
          onClick={() => {
            onConfiguringUpdate(!configuring);
          }}>
          <FontAwesomeIcon icon={faSlidersH} />
        </button>
      )}
      <button
        className={locked ? 'active' : ''}
        onClick={() => {
          onConfiguringUpdate(false);
          onLockedUpdate(!locked);
        }}>
        <FontAwesomeIcon icon={locked ? faLock : faUnlock} />
      </button>
    </header>
  );
}
