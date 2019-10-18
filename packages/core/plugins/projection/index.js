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

  // Send any projections...
  ws.send(JSON.stringify({ type: 'ADD', projections }));

  // Listen for socket close or error? and remove from set
});

exports.router = router;

function dispatch(action) {
  for (let socket of sockets) {
    socket.send(JSON.stringify(action));
  }
}

let previous = null;
let projections = {};

exports.update = state => {
  console.log('updating projection');
  // Check for changes in the cue list
  if (!previous || previous.cues !== state.cues) {
    let newProjections = {};

    for (let cue of state.cues) {
      console.log(cue.id);
      for (let projection of cue.data.projection) {
        newProjections[projection.id] = projection;

        if (!(projection.id in projections)) {
          console.log('Add projection');
        } else {
          if (projections[projection.id] !== projection) {
            console.log('Update projection');
          }

          delete projections[projection.id];
        }
      }
    }

    for (let deletedId in projections) {
      console.log('Delete projection');
    }

    projections = newProjections;
  }
  previous = state;
};

exports.addCue = c => {
  projections.push(c);
  if (latestWs) {
    latestWs.send(JSON.stringify({ type: 'ADD', projections: [c] }));
  }
};

exports.editCue = c => {
  projections = projections.map(p => (p.id === c.id ? c : p));
  if (latestWs) {
    latestWs.send(JSON.stringify({ type: 'EDIT', projection: c }));
  }
};

exports.deleteCue = id => {
  projections = projections.filter(p => p.id !== id);
  if (latestWs) {
    latestWs.send(JSON.stringify({ type: 'DELETE', id }));
  }
};
