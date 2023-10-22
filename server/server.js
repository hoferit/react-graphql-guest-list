const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config({ path: './config.env' });
const port = process.env.PORT || 6000;
const { MongoClient } = require('mongodb'); // Import the MongoDB driver

// Connect to MongoDB
MongoClient.connect(
  process.env.MONGO_URI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err, client) => {
    if (err) {
      console.error('MongoDB connection error:', err);
      process.exit(1); // Exit the application if there's an error
    }
    const db = client.db(); // Get the default database
    console.log('Connected to MongoDB');

    // Pass the database connection to your routes, if needed
    app.use((req, res, next) => {
      req.db = db;
      next();
    });

    // Add your routes here
    app.use(require('./routes/guests'));

    app.listen(port, () => {
      console.log(`Server is running on port: ${port}`);
    });
  },
);
