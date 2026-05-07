const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const authRoutes = require('./routes/auth');
const storyRoutes = require('./routes/stories');
const scrapeRoutes = require('./routes/scrape');
const { scrapeTopStories } = require('./services/scraperService');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
  res.status(200).json({ status: 'ok', message: 'Backend is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/stories', storyRoutes);
app.use('/api/scrape', scrapeRoutes);

const PORT = Number.parseInt(process.env.PORT, 10) || 4000;
const mongoUri = process.env.MONGODB_URI;
const mongoDbName = process.env.MONGODB_DB_NAME;

const startServer = async () => {
  try {
    if (!mongoUri) {
      throw new Error('MONGODB_URI is required in backend/.env');
    }

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is required in backend/.env');
    }

    const mongooseOptions = {
      serverSelectionTimeoutMS: 10000,
    };

    if (mongoDbName) {
      mongooseOptions.dbName = mongoDbName;
    }

    await mongoose.connect(mongoUri, mongooseOptions);

    console.log('Connected to MongoDB');

    try {
      const stories = await scrapeTopStories();
      console.log(`Startup scrape completed: ${stories.length} stories saved`);
    } catch (scrapeError) {
      console.error('Startup scrape failed:', scrapeError.message);
    }

    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (error) {
    console.error('Server startup failed:', error.message);
    process.exit(1);
  }
};

startServer();
