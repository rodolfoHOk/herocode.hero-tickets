import { Event } from '../entities/event';
import { Location } from '../entities/location';
import { User } from '../entities/user';

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

  update(id: string, event: Event): Promise<any>;
}

export { EventRepository };
