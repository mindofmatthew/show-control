const path = require('path');
const express = require('express');
const expressWS = require('express-ws');

const router = express.Router();
expressWS(router);

// TODO: Serve for /client/:id
router.use('/client', express.static(path.join(__dirname, 'app')));

const sockets = new Set();
let audioCues;

router.ws('/_/feed', ws => {
  sockets.add(ws);

  ws.send(
    JSON.stringify({
      type: 'ADD',
      data: audioCues
    })
  );

  // Listen for socket close or error? and remove from set
  ws.on('close', () => {
    sockets.delete(ws);
  });
});

exports.router = router;

function dispatch(action) {
  for (let socket of sockets) {
    socket.send(JSON.stringify(action));
  }
}

let previousCue = -1;

exports.update = state => {
  audioCues = state.cues.flatMap(cue => cue.data.audio);

  const { currentCue } = state.volatile;
  if (currentCue && previousCue !== currentCue) {
    console.log(currentCue);
    dispatch({ type: 'STOP_ALL' });
    for (const audio of state.cues.find(c => c.id === currentCue).data.audio) {
      dispatch({ type: 'START', id: audio.id });
    }
    previousCue = currentCue;
  }
};
