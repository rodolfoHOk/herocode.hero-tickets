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

  async findByLocation(latitude: string, longitude: string): Promise<Event[]> {
    // const cityName = await this.getCityNameByCoordinates(latitude, longitude);
    const cityName = 'Belo Horizonte';

    const eventsByCity = await this.eventRepository.findByCity(cityName);

    const eventsWithRadius3 = eventsByCity.filter((event) => {
      const distance = this.calculateDistance(
        Number(latitude),
        Number(longitude),
        Number(event.location.latitude),
        Number(event.location.longitude)
      );

      return distance <= 3;
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
