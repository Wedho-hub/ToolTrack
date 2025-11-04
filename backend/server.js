import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import toolRoutes from './routes/toolRoutes.js';
import userRoutes from './routes/userRoutes.js';

// Load environment variables
dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['MONGO_URI'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingEnvVars.join(', '));
  console.error('Please check your .env file in the backend directory');
  process.exit(1);
}

// Warn about missing JWT_SECRET
if (!process.env.JWT_SECRET) {
  console.warn('⚠️  JWT_SECRET not found in environment variables. Using default (not recommended for production)');
}

// Initialize express app
const app = express();

// Connect to MongoDB
connectDB();

// --- CORS setup ---
const allowedOrigins = [
  'http://localhost:5173',                     // Local dev (Vite)
  'http://localhost:3000',                     // Local dev (React)
  'https://tooltracking.netlify.app',          // Deployed frontend
  process.env.FRONTEND_URL || ''               // Optional: use ENV
];

// Add any Netlify preview URLs if FRONTEND_URL contains netlify
if (process.env.FRONTEND_URL && process.env.FRONTEND_URL.includes('netlify')) {
  // Allow all netlify deploy previews for this app
  const netlifyBase = process.env.FRONTEND_URL.replace(/https?:\/\//, '').split('.')[0];
  allowedOrigins.push(`https://${netlifyBase}--*.netlify.app`);
}

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like Postman, mobile apps, etc.)
      if (!origin) {
        return callback(null, true);
      }

      // Check exact matches first
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Check for Netlify preview URLs (pattern matching)
      if (origin && origin.includes('netlify.app')) {
        return callback(null, true);
      }

      // Log rejected origins for debugging
      console.warn(`🚫 CORS rejected origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tools', toolRoutes);
app.use('/api/users', userRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err : {},
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌐 API available at: http://localhost:${PORT}/api`);
  console.log(`🔍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔗 Allowed CORS origins:`, allowedOrigins);
});

// Handle server errors
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use. Please try a different port or stop the existing process.`);
  } else {
    console.error('❌ Server error:', error.message);
  }
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🔄 SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🔄 SIGINT received. Shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});
