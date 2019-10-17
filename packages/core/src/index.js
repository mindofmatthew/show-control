const path = require('path');
const express = require('express');
const expressWS = require('express-ws');
const fs = require('fs').promises;

const dmx = require('../plugins/dmx');

const {
  init: projectionInit,
  router: projectionRouter
} = require('../plugins/projection/router');

const { reducer } = require('./reducers');

exports.panopticon = async scoreFile => {
  let score = {};

  let scorePath = path.relative(process.cwd(), scoreFile);

  try {
    score = JSON.parse(await fs.readFile(scorePath));
  } catch (error) {
    console.log(`No score file found. Creating ${scoreFile}`);
    score = JSON.parse(
      await fs.readFile(path.join(__dirname, 'defaultScore.json'))
    );
    await fs.mkdir(path.dirname(scorePath), { recursive: true });
    await fs.writeFile(scorePath, JSON.stringify(score, null, 2));
  }

  // Init plugins
  projectionInit(score);

  const app = express();
  const port = 8000;

  expressWS(app);

  let saveTimeout = 0;

  let state = { volatile: { currentCue: null }, ...score };

  dmx.update(state);

  function updateState(action) {
    state = reducer(state, JSON.parse(action));

    dmx.update(state);

    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
      fs.writeFile(
        scoreFile,
        JSON.stringify(
          state,
          (name, value) => (name === 'volatile' ? undefined : value),
          2
        )
      );
    }, 1000);
  }

  app.ws('/_/score', ws => {
    ws.send(JSON.stringify(state));

    ws.on('message', action => {
      updateState(action);
      ws.send(JSON.stringify(state));
    });
  });

  app.use('/plugins/projection', projectionRouter);

  app.use(express.static(path.join(__dirname, '../public')));
  app.use(
    '/assets',
    express.static(path.join(path.dirname(scorePath), 'assets'))
  );
  app.use(express.text());

  app.listen(port, () => console.log(`Serving on port ${port}`));
};
