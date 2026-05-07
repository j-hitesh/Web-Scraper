const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const authRoutes = require('./routes/auth');
const scrapeRoutes = require('./routes/scrape');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send({ status: 'ok', message: 'Backend is running' });
});

app.use('/auth', authRoutes);
app.use('/scrape', scrapeRoutes);

const PORT = process.env.PORT || 4000;
const mongoUri = process.env.MONGODB_URI;

if (!process.env.MONGODB_DNS_SERVERS) {
  process.env.MONGODB_DNS_SERVERS = '1.1.1.1,8.8.8.8';
}

const mongoOptions = {
  serverSelectionTimeoutMS: 10000,
};

const connectToMongo = async (uri) => {
  await mongoose.connect(uri, mongoOptions);
  console.log(`Connected to MongoDB at ${uri}`);
};

const startApp = async () => {
  try {
    if (!mongoUri) {
      throw new Error('MONGODB_URI is required');
    }

    await connectToMongo(mongoUri);

    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

startApp();
