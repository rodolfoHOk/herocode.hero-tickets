import express, { Application } from 'express';
import { connect } from './infra/database';
import { errorMiddleware } from './middlewares/error.middleware';

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.middlewaresInitialize();
    this.initializeRoutes();
    this.interceptionError();
    connect();
  }

  middlewaresInitialize() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  initializeRoutes() {
    // this.app.use('/', abc);
  }

  interceptionError() {
    this.app.use(errorMiddleware);
  }

  listen() {
    this.app.listen(3333, () => console.log('server is running on port 3333'));
  }
}

export { App };
