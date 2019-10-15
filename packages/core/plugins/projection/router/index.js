const path = require('path');
const express = require('express');
const expressWS = require('express-ws');

const router = express.Router();
expressWS(router);

let latestWs;

// TODO: Serve for /client/:id
router.use('/client', express.static(path.join(__dirname, 'app')));

router.ws('/_/feed', ws => {
  latestWs = ws;
  ws.send(JSON.stringify({ type: 'ADD', projections }));
});

exports.router = router;

let projections = [];

exports.init = score => {
  projections = score.cues.reduce(
    (list, cue) => list.concat(cue.data.projection),
    []
  );
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
