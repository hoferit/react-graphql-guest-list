const { MongoClient } = require('mongodb');
const { ATLAS_URI } = process.env; // Update this to use your .env variable

let _db;

module.exports = {
  connectToServer: function (callback) {
    MongoClient.connect(
      ATLAS_URI,
      { useNewUrlParser: true, useUnifiedTopology: true },
      function (err, client) {
        if (err) {
          console.error(err);
          return callback(err);
        }
        _db = client.db(); // Get the default database
        console.log('Successfully connected to MongoDB.');
        return callback();
      },
    );
  },

  getDb: function () {
    return _db;
  },
};
