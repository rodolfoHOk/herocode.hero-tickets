import mongoose, { ObjectId } from 'mongoose';
import { User } from '../entities/user';
import { UserRepository } from './user.repository';

const userSchema = new mongoose.Schema({
  _id: { type: String, default: new mongoose.Types.ObjectId().toString() },
  name: String,
  email: String,
});

const UserModel = mongoose.model('User', userSchema);

class MongooseUserRepository implements UserRepository {
  async add(user: User): Promise<User> {
    const userModel = new UserModel(user);

    const saveUser = await userModel.save();
    return saveUser.toObject();
  }

  async existsByEmail(email: string): Promise<User | undefined> {
    const existsUser = await UserModel.findOne({ email }).exec();

    return existsUser ? existsUser.toObject() : undefined;
  }
}

export { MongooseUserRepository };
