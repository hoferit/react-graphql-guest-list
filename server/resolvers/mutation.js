const { ObjectId } = require('mongodb');

module.exports = {
  Mutation: {
    addGuest: async (parent, { firstName, lastName }, { db }) => {
      const result = await db
        .collection('guests')
        .insertOne({ firstName, lastName, attending: false });
      return result.ops[0];
    },
    updateGuest: async (parent, { id, attending }, { db }) => {
      const result = await db
        .collection('guests')
        .findOneAndUpdate(
          { _id: ObjectId(id) },
          { $set: { attending } },
          { returnOriginal: false },
        );
      return result.value;
    },
    deleteGuest: async (parent, { id }, { db }) => {
      const result = await db
        .collection('guests')
        .findOneAndDelete({ _id: ObjectId(id) });
      return result.value;
    },
  },
};
