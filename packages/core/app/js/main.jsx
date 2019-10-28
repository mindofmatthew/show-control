import React, { useState, useEffect } from 'react';
import { render } from 'react-dom';

import { Header } from './header';
import { Cue } from './cue';
import { Config } from './config';
import { main } from '../../plugins/audio/client/script';

main();

function App() {
  let [dispatch, setDispatch] = useState(null);
  let [score, setScore] = useState(null);

  useEffect(() => {
    let timeoutId;

    function connect() {
      const socket = new WebSocket(`ws://${location.host}/_/score`);

      socket.addEventListener('open', () => {
        console.info('Connection established');
        setDispatch(() => action => {
          socket.send(JSON.stringify(action));
        });
      });

      socket.addEventListener('message', event => {
        setScore(JSON.parse(event.data));
      });

      socket.addEventListener('close', () => {
        console.warn('Lost connection to server, trying to reconnect');
        setDispatch(null);
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          connect();
        }, 1000);
      });
    }
    connect();

    return () => {
      socket.close();
      clearTimeout(timeoutId);
    };
  }, []);

  let [locked, setLocked] = useState(localStorage.getItem('locked') === 'true');
  useEffect(() => {
    localStorage.setItem('locked', locked);
  }, [locked]);

  let [configuring, setConfiguring] = useState(false);

  if (score === null) {
    return null;
  }

  return (
    <>
      <Header
        title={score.title}
        locked={locked}
        configuring={configuring}
        onLockedUpdate={setLocked}
        onConfiguringUpdate={setConfiguring}
        dispatch={dispatch}
      />
      <Config open={configuring} config={score.config} dispatch={dispatch} />
      <ul className="cue-list">
        {score.cues.map(cue => (
          <Cue
            key={cue.id}
            dispatch={dispatch}
            config={score.config}
            cue={cue}
            current={cue.id === score.volatile.currentCue}
          />
        ))}
      </ul>
      <button onClick={() => dispatch({ type: 'ADD_CUE' })}>Add Cue</button>
    </>
  );
}

window.addEventListener('load', () => {
  render(<App />, document.getElementById('root'));
});
