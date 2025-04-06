import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bseRoutes from './routes/bseRoutes';

// Load environment variables
dotenv.config();

const app = express();
const DEFAULT_PORT = 3000;
const MAX_PORT_ATTEMPTS = 10;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/bse', bseRoutes);

// Basic route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the TypeScript Backend!' });
});

// Function to start server with port retry logic
const startServer = (port: number, attempts: number = 0) => {
    app.listen(port)
        .on('error', (err: NodeJS.ErrnoException) => {
            if (err.code === 'EADDRINUSE' && attempts < MAX_PORT_ATTEMPTS) {
                console.log(`Port ${port} is in use, trying port ${port + 1}...`);
                startServer(port + 1, attempts + 1);
            } else {
                console.error('Failed to start server:', err);
                process.exit(1);
            }
        })
        .on('listening', () => {
            console.log(`Server is running on port ${port}`);
        });
};

// Start server
startServer(DEFAULT_PORT); 