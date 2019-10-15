const path = require('path');
const express = require('express');
const expressWS = require('express-ws');

const router = express.Router();
expressWS(router);

let projections = [];

exports.init = score => {
  console.log(JSON.stringify(score));
  projections = score.cues.reduce(
    (list, cue) => list.concat(cue.data.projection),
    []
  );
};

let latestWs;

// TODO: Serve for /client/:id
router.use('/client', express.static(path.join(__dirname, 'app')));

router.ws('/_/feed', ws => {
  latestWs = ws;
  ws.send(JSON.stringify({ type: 'ADD', projections }));
});

exports.router = router;
exports.render = m => {
  if (latestWs)
    latestWs.send(
      JSON.stringify({
        ...m,
        // Render a white quad instead of the asset for calibration
        mode: 'EDIT'
      })
    );
};
