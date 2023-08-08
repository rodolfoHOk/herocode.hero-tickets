import { Location } from './location';
import { Price } from './price';
import { User } from './user';

class Event {
  constructor(
    public title: string,
    public location: Location,
    public date: Date,
    public description: string,
    public categories: string[],
    public banner: string,
    public coupons: string[],
    public price: Price,
    public city: string,
    public participants: User[]
  ) {}
}

export { Event };
