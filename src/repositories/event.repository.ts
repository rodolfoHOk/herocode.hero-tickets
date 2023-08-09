import { Event } from '../entities/event';
import { Location } from '../entities/location';

interface EventRepository {
  add(event: Event): Promise<Event>;

  findByLocationAndDate(
    location: Location,
    date: Date
  ): Promise<Event | undefined>;
}

export { EventRepository };
