require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

// -------------------------
// MIDDLEWARES
// -------------------------

// Adds secure HTTP headers
app.use(helmet());

// HTTP request logger
app.use(morgan('combined'));

// Enable CORS for all routes (customize if needed)
app.use(cors());

// Parse incoming JSON payloads
app.use(express.json());

// Example route
app.get('/', (req, res) => {
  res.json({ message: 'API running successfully 🚀' });
});

// -------------------------
// GLOBAL ERROR HANDLER
// -------------------------
app.use((err, req, res, next) => {
  console.error('Error:', err.message);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// -------------------------
// START SERVER
// -------------------------
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
