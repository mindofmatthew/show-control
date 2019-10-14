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
