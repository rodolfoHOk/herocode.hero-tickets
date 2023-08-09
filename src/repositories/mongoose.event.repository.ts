import mongoose from 'mongoose';
import { Event } from '../entities/event';
import { EventRepository } from './event.repository';
import { Location } from '../entities/location';

const eventSchema = new mongoose.Schema({
  title: String,
  location: {
    latitude: String,
    longitude: String,
  },
  date: Date,
  description: String,
  categories: [String],
  banner: String,
  flyers: [String],
  coupons: [String],
  price: { type: Array },
  city: String,
  participants: { type: Array, ref: 'User' },
  createdAt: { type: Date, default: Date.now() },
});

const EventModel = mongoose.model('Event', eventSchema);

class MongooseEventRepository implements EventRepository {
  async add(event: Event): Promise<Event> {
    const eventModel = new EventModel(event);

    await eventModel.save();
    return event;
  }

  async findByLocationAndDate(
    location: Location,
    date: Date
  ): Promise<Event | undefined> {
    const findEvent = await EventModel.findOne({ location, date }).exec();

    return findEvent ? findEvent.toObject() : undefined;
  }
}

export { MongooseEventRepository };
