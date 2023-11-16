import { APP_PORT } from './config';
import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes';
import Database from './database/connect';

const App = express();
App.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
App.use(bodyParser.json());
(async () => {
  await new Database().connect();

  App.use(routes);

  App.get('/', async (req, res) => {
    res.status(200).send('Init Page');
  });

  App.listen(APP_PORT, async () => {
    console.log(`Running on ${APP_PORT}...`);
    console.log(`Nodejs server started open http://localhost:${APP_PORT}`);
  });
})();
