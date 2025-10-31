# E-Commerce MERN Backend - Production Ready

This backend has been fully optimized and secured for production deployment.

## 🚀 Major Improvements

### 1. Security Enhancements
- ✅ **Rate Limiting**: Protection against brute force and DDoS attacks
  - Auth endpoints: 5 requests per 15 minutes
  - API endpoints: 100 requests per 15 minutes
  - File uploads: 20 uploads per hour
- ✅ **Input Validation**: Comprehensive Joi validation schemas for all routes
- ✅ **NoSQL Injection Prevention**: express-mongo-sanitize middleware
- ✅ **XSS Protection**: Input sanitization middleware
- ✅ **Security Headers**: Helmet.js with production-ready CSP
- ✅ **CORS Configuration**: Proper origin validation
- ✅ **Request Size Limits**: 10MB max for JSON and file uploads
- ✅ **File Upload Validation**: Type and size restrictions (5MB max per file)

### 2. Error Handling
- ✅ **Global Error Handler**: Centralized error handling middleware
- ✅ **Custom Error Classes**: AppError for operational errors
- ✅ **Async Error Wrapper**: Automatic promise rejection handling
- ✅ **Proper HTTP Status Codes**: Correct status codes for different error types
- ✅ **Error Logging**: Winston logger integration
- ✅ **Graceful Shutdown**: Clean process termination

### 3. Logging System
- ✅ **Winston Logger**: Production-grade logging
- ✅ **Log Levels**: Error, warn, info, http, debug
- ✅ **File Logging**: Separate error.log and combined.log
- ✅ **Log Rotation**: 5MB max size, 5 files history
- ✅ **Request Logging**: Morgan integration with Winston

### 4. Database Improvements
- ✅ **Schema Validation**: Proper field validation in models
- ✅ **Indexes**: Optimized query performance
  - Single field indexes on frequently queried fields
  - Compound indexes for common query patterns
  - Text indexes for search functionality
- ✅ **Virtuals**: Computed fields (finalPrice, stockStatus)
- ✅ **Select Fields**: Sensitive data excluded by default

### 5. API Improvements
- ✅ **HTTP Method Corrections**: Proper REST conventions
  - GET for retrieving data (with query params)
  - POST for creating/authentication
  - PUT for updating
  - DELETE for deletion
- ✅ **Query Parameter Support**: GET endpoints use query params
- ✅ **Population**: Related data populated in responses
- ✅ **Pagination**: Page and limit support

### 6. Environment Configuration
- ✅ **Environment Validation**: Joi schema for env variables
- ✅ **.env.example**: Template for required variables
- ✅ **Default Values**: Sensible defaults for optional configs
- ✅ **Startup Validation**: Server won't start with invalid config

### 7. Code Quality
- ✅ **Bug Fixes**: All critical bugs resolved
  - Port configuration corrected
  - Undefined variable errors fixed
  - Logical operator errors fixed
- ✅ **Authorization Middleware**: Role-based access control
- ✅ **Improved Auth Middleware**: Better JWT error handling
- ✅ **Health Check Endpoint**: `/health` for monitoring

## 📋 Prerequisites

- Node.js >= 16.x
- MongoDB >= 5.x
- npm or yarn

## 🔧 Installation

1. Clone the repository
```bash
git clone <repository-url>
cd server
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
```bash
cp .env.example .env
# Edit .env with your actual values
```

## 🔐 Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment (development/production) | `production` |
| `PORT` | Server port | `8080` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/ecommerce` |
| `SECRET_KEY_ACCESS_TOKEN` | JWT access token secret (min 32 chars) | Generate with: `openssl rand -base64 32` |
| `SECRET_KEY_REFRESH_TOKEN` | JWT refresh token secret (min 32 chars) | Generate with: `openssl rand -base64 32` |
| `FRONTEND_URL` | Frontend URL for CORS | `https://yourdomain.com` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | `your-cloud-name` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `your-api-key` |
| `CLOUDINARY_API_SECRET_KEY` | Cloudinary API secret | `your-api-secret` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `RESEND_API` | Email service API key | - |
| `JWT_ACCESS_EXPIRY` | Access token expiry | `5h` |
| `JWT_REFRESH_EXPIRY` | Refresh token expiry | `7d` |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | `900000` (15 min) |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | `100` |
| `LOG_LEVEL` | Logging level | `info` |

## 🚀 Running the Application

### Development
```bash
npm run dev
```

### Production
```bash
NODE_ENV=production npm start
```

## 📊 Health Check

Access health check endpoint:
```bash
curl http://localhost:8080/health
```

Response:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "production"
}
```

## 🔒 Security Best Practices

### 1. JWT Secrets
Generate strong secrets using:
```bash
openssl rand -base64 32
```

### 2. MongoDB Security
- Use authentication
- Enable SSL/TLS
- Restrict network access
- Use MongoDB Atlas for managed solution

### 3. Rate Limiting
Default limits are conservative. Adjust based on your traffic:
```env
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100   # 100 requests per window
```

### 4. CORS Configuration
Update FRONTEND_URL with your actual domain:
```env
FRONTEND_URL=https://yourdomain.com
```

For multiple origins, use comma-separated values:
```env
FRONTEND_URL=https://yourdomain.com,https://admin.yourdomain.com
```

## 📝 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Rate Limit |
|--------|----------|-------------|------------|
| POST | `/api/user/register` | Register new user | 5/15min |
| POST | `/api/user/login` | User login | 5/15min |
| POST | `/api/user/logout` | User logout | - |
| POST | `/api/user/forgot-password` | Request password reset | 5/15min |
| POST | `/api/user/verify-forgot-password-otp` | Verify OTP | 5/15min |
| POST | `/api/user/reset-password` | Reset password | 5/15min |

### Product Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/product/create` | Create product | Yes (Admin) |
| GET | `/api/product/get?page=1&limit=10&search=query` | Get products | No |
| GET | `/api/product/get-product-by-category?id=categoryId` | Get by category | No |

### Category Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/category/create` | Create category | Yes (Admin) |
| GET | `/api/category/get` | Get all categories | No |
| PUT | `/api/category/update` | Update category | Yes (Admin) |
| DELETE | `/api/category/delete` | Delete category | Yes (Admin) |

## 🗂️ Project Structure

```
server/
├── config/
│   ├── connectDB.js          # Database connection
│   ├── logger.js              # Winston logger configuration
│   ├── sendEmail.js           # Email service
│   └── validateEnv.js         # Environment validation
├── controllers/               # Route controllers
│   ├── user.controller.js
│   ├── product.controller.js
│   ├── category.controller.js
│   ├── subCategory.controller.js
│   └── uploadImage.controller.js
├── middleware/
│   ├── auth.js                # JWT authentication
│   ├── authorize.js           # Role-based authorization
│   ├── errorHandler.js        # Global error handler
│   ├── multer.js              # File upload configuration
│   ├── security.js            # Security middleware
│   └── validation.js          # Joi validation schemas
├── models/                    # Mongoose models
│   ├── user.model.js
│   ├── product.model.js
│   ├── category.model.js
│   └── ...
├── route/                     # API routes
│   ├── user.route.js
│   ├── product.route.js
│   ├── category.route.js
│   └── ...
├── utils/                     # Utility functions
├── logs/                      # Log files (gitignored)
│   ├── error.log
│   └── combined.log
├── .env.example               # Environment template
├── index.js                   # Application entry point
└── package.json
```

## 🔍 Monitoring

### Log Files
- `logs/error.log` - Error logs only
- `logs/combined.log` - All logs

### Log Levels
- `error` - Error messages
- `warn` - Warning messages
- `info` - Informational messages (default)
- `http` - HTTP request logs
- `debug` - Debug information

Change log level in production:
```env
LOG_LEVEL=warn
```

## 🐛 Troubleshooting

### Environment Validation Failed
Check that all required environment variables are set and valid.

### Database Connection Failed
- Verify MONGODB_URI is correct
- Check MongoDB is running
- Verify network access

### Rate Limit Errors (429)
- User is making too many requests
- Check rate limit configuration
- Consider whitelisting certain IPs

### File Upload Errors
- Check file size (max 5MB)
- Verify file type (images only)
- Check Cloudinary credentials

## 📈 Performance Tips

1. **Enable MongoDB Indexes**: Indexes are defined in models, ensure they're created
2. **Use Pagination**: Always use page/limit parameters
3. **Enable Compression**: Already enabled via middleware
4. **Use CDN**: Serve static files from CDN
5. **Enable Caching**: Consider Redis for session/cache
6. **Database Connection Pooling**: Configure in connectDB.js

## 🚢 Deployment

### PM2 (Recommended)
```bash
npm install -g pm2
pm2 start index.js --name ecommerce-api
pm2 save
pm2 startup
```

### Docker
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 8080
CMD ["node", "index.js"]
```

### Nginx Reverse Proxy
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

## 🔄 Migration from Old Version

If upgrading from the old codebase:

1. **Update .env**: Add new required variables from .env.example
2. **Update API Calls**: Some endpoints changed from POST to GET
3. **Update Query Parameters**: GET endpoints now use query params instead of body
4. **Check Password Requirements**: New validation requires strong passwords
5. **Update Error Handling**: Error response format is now consistent

### Breaking Changes
- `/api/product/get` changed from POST to GET (use query params)
- `/api/subcategory/get` changed from POST to GET
- `/api/user/logout` changed from GET to POST
- Password validation now enforces complexity requirements
- Mobile field changed from Number to String

## 📞 Support

For issues and questions:
- Check logs in `logs/` directory
- Review this documentation
- Check `.env.example` for required variables

## 🔐 Security Reporting

Please report security vulnerabilities privately.

## 📄 License

[Your License Here]

---

**Production Ready** ✅
- All critical bugs fixed
- Security hardened
- Error handling implemented
- Logging configured
- Validation added
- Database optimized
- API standardized
