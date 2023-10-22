const { ObjectId } = require('mongodb');

module.exports = {
  Query: {
    guests: async (parent, args, { db }) => {
      return await db.collection('guests').find().toArray();
    },
  },
};
