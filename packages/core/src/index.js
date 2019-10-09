const path = require('path');
const express = require('express');
const app = express();
const port = 8000;

app.use(express.static(path.join(__dirname, '../public')));

app.listen(port, () => console.log(`Serving on port ${port}`));
