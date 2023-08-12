import axios from 'axios';
import { Event } from '../entities/event';
import { HttpException } from '../interfaces/http-exception';
import { EventRepository } from '../repositories/event.repository';
import { MongooseUserRepository } from '../repositories/mongoose.user.repository';

export interface IFilterProps {
  latitude?: number;
  longitude?: number;
  category?: string;
  name?: string;
  date?: string;
  radius?: string;
  price?: string;
}

class EventUseCase {
  constructor(private eventRepository: EventRepository) {}

  async create(eventData: Event): Promise<Event> {
    if (!eventData.banner) {
      throw new HttpException(400, 'Banner is required');
    }
    if (!eventData.flyers) {
      throw new HttpException(400, 'Flyers is required');
    }
    if (!eventData.location) {
      throw new HttpException(400, 'Location is required');
    }
    if (!eventData.date) {
      throw new HttpException(400, 'Date is required');
    }

    const verifyEvent = await this.eventRepository.findByLocationAndDate(
      eventData.location,
      eventData.date
    );
    if (verifyEvent) {
      throw new HttpException(400, 'Event already exists');
    }

    // const { cityName, formattedAddress } = await this.getCityNameByCoordinates(
    //   eventData.location.latitude,
    //   eventData.location.longitude
    // );
    eventData = {
      ...eventData,
      // city: cityName,
      city: eventData.city,
      // formattedAddress,
      formattedAddress: eventData.formattedAddress,
    };

    const result = await this.eventRepository.add(eventData);

    return result;
  }

  async findByLocation(latitude: string, longitude: string): Promise<Event[]> {
    // const { cityName } = await this.getCityNameByCoordinates(
    //   latitude,
    //   longitude
    // );
    const cityName = 'Belo Horizonte';

    const eventsByCity = await this.eventRepository.findByCity(cityName);

    const eventsWithRadius3 = eventsByCity.filter((event) => {
      const distance = this.calculateDistance(
        Number(latitude),
        Number(longitude),
        Number(event.location.latitude),
        Number(event.location.longitude)
      );

      return distance <= 100;
    });

    return eventsWithRadius3;
  }

  async findByCategory(category: string): Promise<Event[]> {
    if (!category) {
      throw new HttpException(400, 'Category is required');
    }

    const events = await this.eventRepository.findByCategory(category);

    return events;
  }

  async filterBy(filter: IFilterProps): Promise<Event[]> {
    const dateFilter = filter.date ? new Date(filter.date) : undefined;

    const events = await this.eventRepository.filterBy({
      name: filter.name,
      date: filter.date,
      category: filter.category,
      price: filter.price,
      latitude: filter.latitude,
      longitude: filter.longitude,
      radius: filter.radius,
    });

    return events;
  }

  async findMain(): Promise<Event[]> {
    const events = await this.eventRepository.findMain(new Date());

    return events;
  }

  async findByName(name: string): Promise<Event[]> {
    if (!name) {
      throw new HttpException(400, 'Name is required');
    }

    const events = await this.eventRepository.findByName(name);

    return events;
  }

  async findById(id: string): Promise<Event | undefined> {
    if (!id) {
      throw new HttpException(400, 'ID is required');
    }

    const events = await this.eventRepository.findById(id);

    return events;
  }

  async addParticipant(id: string, name: string, email: string) {
    let event = await this.eventRepository.findById(id);

    if (!event) {
      throw new HttpException(400, 'Event not found');
    }

    const userRepository = new MongooseUserRepository();

    const participant = {
      name,
      email,
    };

    let user: any = {};

    user = await userRepository.existsByEmail(email);

    if (!user) {
      user = await userRepository.add(participant);
    }

    if (event.participants.includes(user._id)) {
      throw new HttpException(400, 'Participant already exists');
    }

    event.participants.push(user._id);

    await this.eventRepository.update(id, event);

    return event;
  }

  private async getCityNameByCoordinates(latitude: string, longitude: string) {
    const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlong=${latitude},${longitude}&key=${GOOGLE_API_KEY}`
      );

      if (response.data.status === 'OK' && response.data.results.length > 0) {
        const address = response.data.results[0].address_components;
        const cityType = address.find(
          (type: any) =>
            type.types.includes('administrative_area_level_2') &&
            type.types.includes('political')
        );
        const formattedAddress = response.data.results[0].formattedAddress;

        return {
          cityName: cityType.long_name,
          formattedAddress,
        };
      }

      throw new HttpException(404, 'City not found');
    } catch (error) {
      throw new HttpException(401, 'Error request city name');
    }
  }

  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Raio da Terra em quilômetros
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}

export { EventUseCase };
