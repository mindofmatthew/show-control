const path = require('path');
const express = require('express');
const fs = require('fs').promises;

exports.panopticon = scoreFile => {
  const app = express();
  const port = 8000;

  app.use(express.static(path.join(__dirname, '../public')));
  app.use(express.text());

  app.listen(port, () => console.log(`Serving on port ${port}`));

  app.get('/_/score', async (req, res) => {
    let contents = 'null';
    try {
      contents = await fs.readFile(`${scoreFile}`);
    } catch {}
    res.type('text/plain').send(contents);
  });

  app.put('/_/score', async (req, res) => {
    const contents = req.body;
    await fs.writeFile(`${scoreFile}`, contents);
    res.type('text/plain').send(contents);
  });
};
