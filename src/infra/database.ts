import mongoose from 'mongoose';

export async function connect() {
  try {
    await mongoose.connect(
      'mongodb+srv://rodolfohokino:IKcoGk5QncYhTkeY@cluster0.s8iey.mongodb.net/hero-tickets'
    );
    console.log('Connect database success');
  } catch (error) {
    console.error('Database connect error', error);
  }
}
