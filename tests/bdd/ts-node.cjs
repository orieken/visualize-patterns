const path = require('node:path');

process.env.TS_NODE_PROJECT = path.join(__dirname, 'tsconfig.json');

require('ts-node').register({
  project: process.env.TS_NODE_PROJECT,
  transpileOnly: true
});
