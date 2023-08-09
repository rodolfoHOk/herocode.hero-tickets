import { Location } from './location';
import { Price } from './price';

class Event {
  constructor(
    public title: string,
    public location: Location,
    public date: Date,
    public description: string,
    public categories: string[],
    public banner: string,
    public flyers: string[],
    public coupons: string[],
    public price: Price[],
    public city: string,
    public participants: string[]
  ) {}
}

export { Event };
