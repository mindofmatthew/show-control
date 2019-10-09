import React, { useReducer } from 'react';
import { render } from 'react-dom';

import { Cue } from './components/Cue';
import { Config } from './components/config';

import { reducer, defaultState } from './reducers';
import { ACTION_TYPE } from './reducers/symbols';

function App() {
  const [program, dispatch] = useReducer(reducer, defaultState);

  return (
    <>
      <header>
        <h1>Panopticon</h1>
      </header>
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
