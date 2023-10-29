import { ObjectId } from 'mongodb';

const resolvers = {
  Query: {
    guests: async (parent, args, { db }) => {
      return await db.collection('guests').find().toArray();
    },
  },
  Mutation: {
    createGuestMutation: async (parent, { firstName, lastName }, { db }) => {
      try {
        const result = await db
          .collection('guests')
          .insertOne({ firstName, lastName, attending: false });

        if (result.ops && result.ops.length > 0) {
          return result.ops[0];
        } else {
          throw new Error('Failed to create a new guest.');
        }
      } catch (error) {
        console.error('Error creating guest:', error);
        throw error; // Re-throw the error for GraphQL to handle
      }
    },
    updateGuestMutation: async (parent, { id, attending }, { db }) => {
      const result = await db
        .collection('guests')
        .findOneAndUpdate(
          { _id: ObjectId(id) },
          { $set: { attending } },
          { returnOriginal: false },
        );
      return result.value;
    },
    deleteGuestMutation: async (parent, { id }, { db }) => {
      const result = await db
        .collection('guests')
        .findOneAndDelete({ _id: ObjectId(id) });
      return result.value;
    },
  },
};

export default resolvers;
