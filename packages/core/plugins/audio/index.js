const path = require('path');
const express = require('express');
const expressWS = require('express-ws');

const router = express.Router();
expressWS(router);

// TODO: Serve for /client/:id
router.use('/client', express.static(path.join(__dirname, 'app')));

const sockets = new Set();

router.ws('/_/feed', ws => {
  sockets.add(ws);

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

exports.update = state => {};
