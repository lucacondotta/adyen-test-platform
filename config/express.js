const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const controllers = require('../controller');

const setupExpress = () => {
  const app = express();
  const router = express.Router();

  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.text());
  app.use(bodyParser.urlencoded({extended:true}));

  app.set('port', process.env.PORT || 3001);
  app.set('view engine', 'pug');

  controllers(router);

  app.use('/', router);
  app.use(express.static(path.join(__dirname, '../public')));

  app.listen(app.get('port'), () => {
    console.log(`Express server listening on port ${app.get('port')}`);
  });
};

module.exports = setupExpress;
