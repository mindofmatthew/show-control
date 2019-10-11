import React, { useState, useReducer, useEffect } from 'react';
import { render } from 'react-dom';

import { Header } from './components/header';
import { Cue } from './components/cue';
import { Config } from './components/config';

import { reducer, defaultState } from './reducers';
import { ACTION_TYPE } from './reducers/symbols';

function App() {
  const [program, dispatch] = useReducer(reducer, null);
  const [isSaved, setIsSaved] = useState(true);

  useEffect(() => {
    (async () => {
      const r = await fetch('/_/score');
      const score = await r.json();
      dispatch({ [ACTION_TYPE]: 'LOAD_SCORE', score: score || defaultState });
    })();
  }, []);

  useEffect(() => {
    setIsSaved(false);
    if (program !== null) {
      const timeoutId = setTimeout(() => {
        fetch('/_/score', {
          method: 'put',
          body: JSON.stringify(program, null, 2)
        }).then(() => {
          setIsSaved(true);
        });
      }, 1000);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [program]);

  if (program === null) {
    return null;
  }

  return (
    <>
      <Header saved={isSaved} />
      <Config config={program.config} dispatch={dispatch} />
      <ul className="cue-list">
        {program.cues.map(cue => (
          <Cue
            key={cue.id}
            dispatch={dispatch}
            config={program.config}
            cue={cue}
          />
        ))}
      </ul>
      <button onClick={() => dispatch({ [ACTION_TYPE]: 'ADD_CUE' })}>
        Add Cue
      </button>
    </>
  );
}

window.addEventListener('load', () => {
  render(<App />, document.getElementById('root'));
});
