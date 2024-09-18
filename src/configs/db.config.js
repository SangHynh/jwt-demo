const mongoose = require('mongoose');

mongoose
  .connect(process.env.MONGODB_URI, {
    dbName: process.env.MONGODB_DATABASE_NAME,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 50,
  })
  .then(() => {
    console.log('Connected to MongoDB successfully');
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
  });

module.exports = mongoose; 
