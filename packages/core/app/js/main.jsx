import React, { useState, useEffect } from 'react';
import { render } from 'react-dom';

import { Header } from './header';
import { CueList } from './cue';
import { Config } from './config';

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
  
  useEffect(() => {
    window.addEventListener('keydown', evt => {
      switch(evt.key) {
        case 'Backspace':
          console.log('delete cue');
          return;
        case 'ArrowUp':
          console.log('up arrow');
          return;
        case 'ArrowDown':
          console.log('down arrow');
          return;
        default:
          console.log(evt.key);
          return;
      }
    });
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
      <CueList cues={score.cues} dispatch={dispatch} />
      <button onClick={() => dispatch({ type: 'ADD_CUE' })}>Add Cue</button>
    </>
  );
}

window.addEventListener('load', () => {
  render(<App />, document.getElementById('root'));
});
