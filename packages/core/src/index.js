const path = require('path');
const express = require('express');
const expressWS = require('express-ws');
const fs = require('fs').promises;

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
    await fs.writeFile(scorePath, JSON.stringify(score));
  }

  const app = express();
  const port = 8000;

  expressWS(app);

  let saveTimeout = 0;

  app.ws('/_/score', ws => {
    ws.send(JSON.stringify(score));

    ws.on('message', action => {
      score = reducer(score, JSON.parse(action));
      ws.send(JSON.stringify(score));
      clearTimeout(saveTimeout);
      saveTimeout = setTimeout(() => {
        fs.writeFile(scoreFile, JSON.stringify(score, null, 2));
      }, 1000);
    });
  });

  app.use(express.static(path.join(__dirname, '../public')));
  app.use(express.text());

  app.listen(port, () => console.log(`Serving on port ${port}`));
};
