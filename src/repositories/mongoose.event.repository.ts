import mongoose from 'mongoose';
import { Event } from '../entities/event';
import { EventRepository } from './event.repository';

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
}

export { MongooseEventRepository };
