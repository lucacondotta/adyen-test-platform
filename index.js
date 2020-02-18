const dotenv = require('dotenv');

try {
  dotenv.config();
} catch (e) {
  console.error('missing env file', e);
}

const setupExpress = require('./config/express');

setupExpress();
