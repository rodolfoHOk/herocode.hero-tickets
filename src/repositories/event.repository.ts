import { Event } from '../entities/event';
import { Location } from '../entities/location';

interface EventRepository {
  add(event: Event): Promise<Event>;

  findByLocationAndDate(
    location: Location,
    date: Date
  ): Promise<Event | undefined>;

  findByCity(city: string): Promise<Event[]>;

  findByCategory(category: string): Promise<Event[]>;

  findByName(name: string): Promise<Event[]>;

  findById(id: string): Promise<Event | undefined>;
}

export { EventRepository };
