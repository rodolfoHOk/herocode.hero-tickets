import { NextFunction, Request, Response } from 'express';
import { EventUseCase } from '../use-cases/event.use-case';
import { Event } from '../entities/event';

class EventController {
  constructor(private eventUseCase: EventUseCase) {}

  async create(request: Request, response: Response, next: NextFunction) {
    const eventData: Event = request.body;

    try {
      await this.eventUseCase.create(eventData);

      return response
        .status(201)
        .json({ message: 'Evento criado com sucesso' });
    } catch (error) {
      next(error);
    }
  }
}

export { EventController };
