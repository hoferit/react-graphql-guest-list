import { ObjectId } from 'mongodb';
import connectToDatabase from '../db/conn.js';

const db = await connectToDatabase();

const resolvers = {
  Query: {
    guests: async (_, args, context) => {
      const collection = await db.collection('guests');
      const guestList = await collection.find().toArray();

      // Map MongoDB _id to custom id field for GraphQL compatibility
      return guestList.map((guest) => ({
        ...guest,
        id: guest._id.toString(), // Convert ObjectId to a string
      }));
    },
  },
  Mutation: {
    createGuestMutation: async (_, { firstName, lastName }, context) => {
      const collection = await db.collection('guests');
      const result = await collection.insertOne({
        firstName,
        lastName,
        attending: false,
      });

      if (result.acknowledged) {
        return {
          firstName,
          lastName,
          attending: false,
          id: result.insertedId.toString(),
        };
      } else {
        throw new Error('Failed to create a new guest.');
      }
    },
    updateGuestMutation: async (_, { id, attending }, context) => {
      const query = { _id: new ObjectId(id) };
      const collection = await db.collection('guests');
      const update = await collection.updateOne(query, { $set: { attending } });

      if (update.acknowledged) {
        return await collection.findOne(query);
      } else {
        return null;
      }
    },
    deleteGuestMutation: async (_, { id }, context) => {
      const collection = await db.collection('guests');
      const dbDelete = await collection.deleteOne({ _id: new ObjectId(id) });

      return dbDelete.acknowledged && dbDelete.deletedCount === 1;
    },
  },
};

export default resolvers;
