const express = require('express');
const cors = require('cors');

const transactionRoutes = require('./routes/transactionRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/transactions', transactionRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('API is running...');
});

module.exports = app;
