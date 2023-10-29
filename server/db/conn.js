import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import { MongoClient } from 'mongodb';

dotenv.config({ path: 'config.env' });

async function connectToDatabase() {
  const connectionString = process.env.ATLAS_URI || '';
  const client = new MongoClient(connectionString);

  try {
    await client.connect();
    const db = client.db(); // Get a reference to the database
    return db;
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
}
export default connectToDatabase;
