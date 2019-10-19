const path = require('path');
const express = require('express');
const expressWS = require('express-ws');

let previous = null;
let projections = {};

const router = express.Router();
expressWS(router);

// TODO: Serve for /client/:id
router.use('/client', express.static(path.join(__dirname, 'app')));

const sockets = new Set();

router.ws('/_/feed', ws => {
  sockets.add(ws);

  ws.send(
    JSON.stringify({ type: 'ADD', projections: Object.values(projections) })
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

exports.update = state => {
  // Check for changes in the cue list
  if (!previous || previous.cues !== state.cues) {
    let newProjections = {};

    for (let cue of state.cues) {
      for (let projection of cue.data.projection) {
        newProjections[projection.id] = projection;

        if (!(projection.id in projections)) {
          dispatch({ type: 'ADD', projections: [projection] });
        } else {
          if (projections[projection.id] !== projection) {
            if (projections[projection.id].corners !== projection.corners) {
              dispatch({
                type: 'EDIT_CORNERS',
                id: projection.id,
                corners: projection.corners
              });
            }

            if (projections[projection.id].asset !== projection.asset) {
              dispatch({
                type: 'EDIT_ASSET',
                id: projection.id,
                asset: projection.asset
              });
            }
          }

          delete projections[projection.id];
        }
      }
    }

    for (let deletedId in projections) {
      dispatch({ type: 'DELETE', id: deletedId });
    }

    projections = newProjections;
  }
  previous = state;
};
