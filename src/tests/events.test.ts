import request from 'supertest';
import { Event } from '../entities/event';
import { App } from '../app';
import { EventUseCase } from '../use-cases/event.use-case';
import { EventRepository } from '../repositories/event.repository';

const app = new App().app;

describe('Event test', () => {
  it('/POST Event', async () => {
    const event: Event = {
      title: 'Jorge e Mateus',
      price: [
        {
          amount: '20',
          sector: 'Pista',
        },
      ],
      description: 'Show musical de Jorge e Mateus',
      city: 'Belo Horizonte',
      location: {
        latitude: '-19.8682854',
        longitude: '-43.981556',
      },
      coupons: [],
      date: new Date(),
      participants: [],
      categories: ['Show', 'Sertanejo universitário'],
      banner: '',
      flyers: [],
    };

    const response = await request(app)
      .post('/events')
      .field('title', event.title)
      .field('description', event.description)
      .field('city', event.city)
      .field('date', event.date.toISOString())
      .field('coupons', event.coupons)
      .field('participants', [])
      .field('categories', event.categories[0])
      .field('categories', event.categories[1])
      .field('location[latitude]', event.location.latitude)
      .field('location[longitude]', event.location.longitude)
      .field('price[amount]', event.price[0].amount)
      .field('price[sector]', event.price[0].sector)
      .attach('banner', '/home/rodolfo/Downloads/banner.jpg')
      .attach('flyers', '/home/rodolfo/Downloads/flyer1.jpg')
      .attach('flyers', '/home/rodolfo/Downloads/flyer2.jpg');

    if (response.error) {
      console.log('events test error', response.error);
    }

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ message: 'Evento criado com sucesso' });
  });
});

const event: Event = {
  title: 'Jorge e Mateus',
  price: [
    {
      amount: '20',
      sector: 'Pista',
    },
  ],
  description: 'Show musical de Jorge e Mateus',
  city: 'Belo Horizonte',
  location: {
    latitude: '-19.8682854',
    longitude: '-43.981556',
  },
  coupons: [],
  date: new Date(),
  participants: [],
  categories: ['Show', 'Sertanejo universitário'],
  banner: 'banner.jpg',
  flyers: ['flyer1.jpg', 'flyer2.jpg'],
};

const eventRepository = {
  add: jest.fn(),
  findByLocationAndDate: jest.fn(),
  findByCity: jest.fn(),
  findByCategory: jest.fn(),
  findByName: jest.fn(),
  findById: jest.fn(),
};

const eventUseCase = new EventUseCase(eventRepository);

describe.only('Event unit test', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return an array of events by category', async () => {
    eventRepository.findByCategory.mockResolvedValue([event]);
    const result = await eventUseCase.findByCategory('Show');

    expect(eventRepository.findByCategory).toHaveBeenCalledWith('Show');
    expect(result).toEqual([event]);
  });

  it('should return an array of events by name', async () => {
    eventRepository.findByName.mockResolvedValue([event]);
    const result = await eventUseCase.findByName('Jorge e Mateus');

    expect(eventRepository.findByName).toHaveBeenCalledWith('Jorge e Mateus');
    expect(result).toEqual([event]);
  });

  it('should return a event by ID', async () => {
    eventRepository.findById.mockResolvedValue(event);
    const result = await eventUseCase.findById('id');

    expect(eventRepository.findById).toHaveBeenCalledWith('id');
    expect(result).toEqual(event);
  });
});
