#!/usr/bin/env node

const { panopticon } = require('../src/index.js');
const argv = require('minimist')(process.argv.slice(2));

panopticon(argv._[0]);
