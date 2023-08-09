import { NextFunction, Request, Response } from 'express';
import { EventUseCase } from '../use-cases/event.use-case';
import { Event } from '../entities/event';

class EventController {
  constructor(private eventUseCase: EventUseCase) {}

  async create(request: Request, response: Response, next: NextFunction) {
    let eventData: Event = request.body;

    const files = request.files;

    if (files) {
      // @ts-ignore
      const banner = files.banner[0];
      // @ts-ignore
      const flyers = files.flyers;

      eventData = {
        ...eventData,
        banner: banner.filename,
        flyers: flyers.map((flyer: any) => flyer.filename),
      };
    }

    try {
      await this.eventUseCase.create(eventData);

      return response
        .status(201)
        .json({ message: 'Evento criado com sucesso' });
    } catch (error) {
      next(error);
    }
  }

  async findByLocation(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const { latitude, longitude } = request.query;

    try {
      const events = await this.eventUseCase.findByLocation(
        String(latitude),
        String(longitude)
      );

      return response.status(200).json(events);
    } catch (error) {
      next(error);
    }
  }

  async findByCategory(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const { category } = request.params;

    try {
      const events = await this.eventUseCase.findByCategory(String(category));

      return response.status(200).json(events);
    } catch (error) {
      next(error);
    }
  }
}

export { EventController };
