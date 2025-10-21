import mongoose from 'mongoose';

export async function connectMongo(
  url = process.env.MONGO_URL || 'mongodb://localhost:27017/app',
) {
  mongoose.set('strictQuery', true);
  await mongoose.connect(url);
  console.log(`[mongo] connected: ${url}`);
}
