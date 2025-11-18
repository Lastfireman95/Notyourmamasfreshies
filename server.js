const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// ========== SECURITY MIDDLEWARE ==========

// Helmet helps secure Express apps by setting various HTTP headers
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
}));

// Enable CORS with restrictions
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:8000'],
    credentials: true
}));

// Parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname)));

// Rate limiting for login attempts
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
    message: { success: false, message: 'Too many login attempts, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});

// General API rate limiter
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: { success: false, message: 'Too many requests, please try again later.' }
});

// ========== CONFIGURATION ==========

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-CHANGE-THIS-IN-PRODUCTION';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'CarolinePurcell';

// Hash the password on server startup (in production, this should come from a database)
// To generate a hash, run: node -e "const bcrypt = require('bcrypt'); bcrypt.hash('Mustang/75', 10).then(console.log);"
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || '$2b$10$YourHashedPasswordHere';

// ========== AUTHENTICATION ENDPOINTS ==========

// Login endpoint
app.post('/api/admin/login', loginLimiter, async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate input
        if (!username || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Username and password are required' 
            });
        }

        // Check username
        if (username !== ADMIN_USERNAME) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid credentials' 
            });
        }

        // Verify password
        const isValid = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
        
        if (!isValid) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid credentials' 
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { 
                username: username,
                role: 'admin',
                iat: Date.now()
            },
            JWT_SECRET,
            { expiresIn: '30m' } // Token expires in 30 minutes
        );

        res.json({ 
            success: true, 
            token,
            expiresIn: 1800 // 30 minutes in seconds
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error during login' 
        });
    }
});

// Verify token endpoint
app.post('/api/admin/verify', apiLimiter, (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ 
            success: false, 
            message: 'No token provided' 
        });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        res.json({ 
            success: true, 
            user: { 
                username: decoded.username,
                role: decoded.role 
            } 
        });
    } catch (error) {
        res.status(403).json({ 
            success: false, 
            message: 'Invalid or expired token' 
        });
    }
});

// ========== MIDDLEWARE TO PROTECT ROUTES ==========

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ 
            success: false, 
            message: 'Access denied. No token provided.' 
        });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ 
                success: false, 
                message: 'Invalid or expired token' 
            });
        }
        req.user = user;
        next();
    });
}

// ========== PROTECTED ROUTES ==========

// Get dashboard data (protected)
app.get('/api/admin/dashboard', authenticateToken, (req, res) => {
    res.json({ 
        success: true,
        message: 'Welcome to the admin dashboard',
        user: req.user.username
    });
});

// Get orders (protected)
app.get('/api/admin/orders', authenticateToken, (req, res) => {
    // In production, fetch from database
    res.json({ 
        success: true,
        orders: [] // Replace with actual data from database
    });
});

// ========== UTILITY ENDPOINT ==========

// Generate password hash (for development only - remove in production)
app.post('/api/utils/hash-password', async (req, res) => {
    if (process.env.NODE_ENV === 'production') {
        return res.status(404).json({ message: 'Not found' });
    }
    
    const { password } = req.body;
    if (!password) {
        return res.status(400).json({ message: 'Password required' });
    }
    
    const hash = await bcrypt.hash(password, 10);
    res.json({ hash });
});

// ========== ERROR HANDLING ==========

// 404 handler
app.use((req, res) => {
    res.status(404).json({ 
        success: false, 
        message: 'Route not found' 
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({ 
        success: false,
        message: process.env.NODE_ENV === 'production' 
            ? 'Internal server error' 
            : err.message 
    });
});

// ========== START SERVER ==========

app.listen(PORT, () => {
    console.log(`🔒 Secure server running on port ${PORT}`);
    console.log(`📂 Serving static files from: ${__dirname}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'your-secret-key-CHANGE-THIS-IN-PRODUCTION') {
        console.warn('⚠️  WARNING: Using default JWT_SECRET. Please set a secure secret in .env file!');
    }
    
    if (!process.env.ADMIN_PASSWORD_HASH) {
        console.warn('⚠️  WARNING: No ADMIN_PASSWORD_HASH set. Please generate and set in .env file!');
    }
});

module.exports = app;
