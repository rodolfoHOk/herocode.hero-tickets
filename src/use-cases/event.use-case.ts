import { Event } from '../entities/event';
import { EventRepository } from '../repositories/event.repository';

class EventUseCase {
  constructor(private eventRepository: EventRepository) {}

  async create(eventData: Event): Promise<Event> {
    const result = await this.eventRepository.add(eventData);
    return result;
  }
}

export { EventUseCase };
