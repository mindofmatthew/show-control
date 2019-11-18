const path = require('path');
const express = require('express');
const expressWS = require('express-ws');
const fs = require('fs').promises;
const { watch } = require('fs');

const dmx = require('../plugins/dmx');
const projection = require('../plugins/projection');
// const audio = require('../plugins/audio');

const { mutate } = require('./state');

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

  const app = express();
  const port = 8000;

  expressWS(app);

  let saveTimeout = 0;

  let state = { volatile: { currentCue: null }, ...score };

  let updatingScoreFile = false;

  dmx.update(state);
  projection.update(state);
  // audio.update(state);

  function updateState(action) {
    state = mutate(state, JSON.parse(action));

    dmx.update(state);
    projection.update(state);
    // audio.update(state);

    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(async () => {
      updatingScoreFile = true;
      await fs.writeFile(
        scoreFile,
        JSON.stringify(
          state,
          (name, value) => (name === 'volatile' ? undefined : value),
          2
        )
      );
      updatingScoreFile = false;
    }, 1000);
  }

  app.ws('/_/score', ws => {
    ws.send(JSON.stringify(state));

    ws.on('message', action => {
      updateState(action);
      ws.send(JSON.stringify(state));
    });

    let timeoutId;
    watch(scorePath).on('change', () => {
      if (updatingScoreFile) return;
      clearTimeout(timeoutId);
      // Debounce the update because when a file is saved, at
      // least in the Chrome OS editor, multiple events come
      // in and the first one is too early; the file is
      // incomplete, leading to JSON parse errors.
      timeoutId = setTimeout(async () => {
        state = { ...state, ...JSON.parse(await fs.readFile(scorePath)) };
        ws.send(JSON.stringify(state));
      }, 50);
    });
  });

  app.use('/plugins/projection', projection.router);
  // app.use('/plugins/audio', audio.router);

  app.use(express.static(path.join(__dirname, '../public')));
  app.use(
    '/assets',
    express.static(path.join(path.dirname(scorePath), 'assets'))
  );
  app.use(express.text());

  app.listen(port, () => console.log(`Serving on port ${port}`));
};
