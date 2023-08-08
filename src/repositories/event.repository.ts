import { Event } from '../entities/event';

interface EventRepository {
  add(event: Event): Promise<Event>;
}

export { EventRepository };
