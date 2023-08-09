import { Router } from 'express';
import { MongooseEventRepository } from '../repositories/mongoose.event.repository';
import { EventController } from '../controllers/event.controller';
import { EventUseCase } from '../use-cases/event.use-case';
import { upload } from '../infra/multer';

class EventRoutes {
  public router: Router;
  private eventController: EventController;

  constructor() {
    this.router = Router();
    const eventRepository = new MongooseEventRepository();
    const eventUseCase = new EventUseCase(eventRepository);
    this.eventController = new EventController(eventUseCase);
    this.initRoutes();
  }

  initRoutes() {
    this.router.post(
      '/',
      upload.fields([
        { name: 'banner', maxCount: 1 },
        { name: 'flyers', maxCount: 3 },
      ]),
      this.eventController.create.bind(this.eventController)
    );

    this.router.get(
      '/',
      this.eventController.findByLocation.bind(this.eventController)
    );

    this.router.get(
      '/:id',
      this.eventController.findById.bind(this.eventController)
    );

    this.router.get(
      '/category/:category',
      this.eventController.findByCategory.bind(this.eventController)
    );

    this.router.get(
      '/name/:name',
      this.eventController.findByName.bind(this.eventController)
    );

    this.router.post(
      '/:id/participants',
      this.eventController.addParticipant.bind(this.eventController)
    );
  }
}

export { EventRoutes };
