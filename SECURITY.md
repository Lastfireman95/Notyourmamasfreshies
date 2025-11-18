# Security Implementation Guide

## 🔒 Security Features Implemented

### 1. **Session-Based Authentication**
- ✅ Admin dashboard now requires valid session token
- ✅ 30-minute session timeout
- ✅ Automatic redirect to login on unauthorized access
- ✅ Token generation with timestamp validation

### 2. **Login Protection**
- ✅ Rate limiting: 5 failed attempts locks account for 15 minutes
- ✅ Failed attempt tracking
- ✅ Automatic lockout and unlock system

### 3. **XSS Protection**
- ✅ Input sanitization for all user-generated content
- ✅ HTML escaping for customer names, emails, phone numbers, and special requests

### 4. **Backend Security (Node.js/Express)**
- ✅ JWT token authentication
- ✅ Password hashing with bcrypt
- ✅ Rate limiting on API endpoints
- ✅ Helmet.js for security headers
- ✅ CORS protection
- ✅ Environment variable management

## 🚀 Getting Started

### Step 1: Install Dependencies

\`\`\`bash
npm install
\`\`\`

### Step 2: Generate Security Keys

Generate a secure JWT secret:
\`\`\`bash
npm run generate-secret
\`\`\`

Generate password hash:
\`\`\`bash
npm run hash-password "Mustang/75"
\`\`\`

### Step 3: Configure Environment Variables

1. Copy `.env.example` to `.env`:
\`\`\`bash
cp .env.example .env
\`\`\`

2. Edit `.env` and update:
   - `JWT_SECRET` - Use the secret generated in Step 2
   - `ADMIN_PASSWORD_HASH` - Use the hash generated in Step 2

### Step 4: Start the Server

Development mode (with auto-restart):
\`\`\`bash
npm run dev
\`\`\`

Production mode:
\`\`\`bash
npm start
\`\`\`

The server will run on `http://localhost:3000`

## 📝 Current Implementation Status

### ✅ Completed (Client-Side)
- Session authentication check on admin dashboard
- 30-minute session timeout
- Login attempt tracking (5 attempts = 15-minute lockout)
- Secure token generation with timestamps
- XSS protection via input sanitization
- Automatic redirect on unauthorized access

### ✅ Completed (Server-Side)
- Express.js server with security middleware
- JWT authentication endpoints
- Password hashing with bcrypt
- Rate limiting (5 login attempts per 15 minutes)
- Helmet.js security headers
- CORS protection
- Environment variable configuration
- API structure for future database integration

### 🔄 Recommended Next Steps

1. **Database Integration**
   - Store orders in PostgreSQL/MongoDB instead of localStorage
   - Store admin credentials in database
   - Add proper user management

2. **HTTPS/SSL**
   - Enable HTTPS in production
   - Get SSL certificate (Let's Encrypt)
   - Force HTTPS redirects

3. **Enhanced Authentication**
   - Two-factor authentication (2FA)
   - Password reset functionality
   - Session management with Redis

4. **Monitoring & Logging**
   - Add logging system (Winston/Morgan)
   - Monitor failed login attempts
   - Alert on suspicious activity

5. **Testing**
   - Add unit tests for authentication
   - Add integration tests for API
   - Security penetration testing

## 🔐 Security Best Practices

### What's Protected:
- ✅ Admin dashboard requires authentication
- ✅ Sessions expire after 30 minutes
- ✅ Failed login attempts are tracked and locked out
- ✅ User input is sanitized to prevent XSS attacks
- ✅ Passwords are hashed (never stored in plain text)
- ✅ JWT tokens for API authentication
- ✅ Rate limiting prevents brute force attacks

### Current Limitations:
- ⚠️ Still using localStorage for orders (should use database)
- ⚠️ Credentials still hardcoded in frontend (move to backend API)
- ⚠️ No HTTPS (required for production)
- ⚠️ No database (data lost on refresh in production)
- ⚠️ Single admin account (should support multiple users)

## 🌐 Deployment Recommendations

### For Production:
1. Use a hosting service with HTTPS (Netlify, Vercel, Heroku, AWS)
2. Set up proper environment variables on hosting platform
3. Use a real database (PostgreSQL, MongoDB, MySQL)
4. Remove development utilities from server.js
5. Set `NODE_ENV=production` in environment
6. Enable all security headers
7. Set up monitoring and alerts
8. Regular security audits

### Environment Variables Required:
- `NODE_ENV=production`
- `PORT=3000` (or assigned by hosting)
- `JWT_SECRET` (strong random string)
- `ADMIN_PASSWORD_HASH` (bcrypt hash)
- `ADMIN_USERNAME`
- `ALLOWED_ORIGINS` (your domain)

## 📞 Admin Login Credentials

**Username:** CarolinePurcell  
**Password:** Mustang/75

**Security Notes:**
- Change the default password immediately
- Password hash must be generated and stored in `.env`
- Never commit `.env` file to git (already in .gitignore)

## 🧪 Testing Security Features

### Test Session Timeout:
1. Login to admin dashboard
2. Wait 30 minutes
3. Try to interact - should redirect to login

### Test Login Lockout:
1. Go to admin login
2. Enter wrong password 5 times
3. Account locks for 15 minutes
4. Wait 15 minutes - lockout automatically clears

### Test XSS Protection:
1. Submit order with special characters: `<script>alert('test')</script>`
2. Check admin dashboard - should display as plain text, not execute

## 📚 Additional Resources

- [Express.js Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [JWT.io](https://jwt.io/) - Learn about JWT tokens
- [Helmet.js](https://helmetjs.github.io/) - Security headers

---

**Remember:** Security is an ongoing process. Regularly update dependencies, monitor for vulnerabilities, and follow security best practices.
