import { Router } from 'express';

class EventRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initRoutes();
  }

  initRoutes() {
    this.router.post('/', () => {});
  }
}

export { EventRoutes };
