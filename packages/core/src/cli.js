#!/usr/bin/env node

const path = require('path');
const { panopticon } = require('../src/index.js');
const argv = require('minimist')(process.argv.slice(2));

panopticon(path.relative(process.cwd(), argv._[0]));
