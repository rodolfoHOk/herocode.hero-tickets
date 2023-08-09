import axios from 'axios';

import { Event } from '../entities/event';
import { HttpException } from '../interfaces/http-exception';
import { EventRepository } from '../repositories/event.repository';

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

    const verifyEvent = await this.eventRepository.findByLocationAndDate(
      eventData.location,
      eventData.date
    );
    if (verifyEvent) {
      throw new HttpException(400, 'Event already exists');
    }

    // const cityName = await this.getCityNameByCoordinates(
    //   eventData.location.latitude,
    //   eventData.location.longitude
    // );
    eventData = {
      ...eventData,
      // city: cityName,
      city: eventData.city,
    };

    const result = await this.eventRepository.add(eventData);

    return result;
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
        return cityType.long_name;
      }

      throw new HttpException(404, 'City not found');
    } catch (error) {
      throw new HttpException(401, 'Error request city name');
    }
  }
}

export { EventUseCase };
