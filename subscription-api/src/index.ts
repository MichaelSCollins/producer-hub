import express from 'express';
import mongoose from 'mongoose';
import app from './app';
import './models/Subscription'; // Import the Subscription model
import './models/Document'; // Import the Document model
import router from './routes/subscriptionRoutes';

const PORT = process.env.PORT || 4444;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/subscription-api';

// Connect to MongoDB
mongoose.connect(MONGO_URI, {})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));

app.listen(PORT, () => {
    console.log(`Subscription API running at http://localhost:${PORT}`);
});