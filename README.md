# Rwanda Service Marketplace 🇷🇼

**Digitizing and connecting Rwanda's Real Estate Value Chain Players**

A comprehensive service marketplace platform for the real estate industry in Rwanda, connecting service seekers with trusted providers like plumbers, electricians, construction firms, interior designers, and more.

## 🚀 Features

- **Multi-platform**: Web app (Next.js) and Mobile app (React Native/Expo)
- **User Management**: Service providers, seekers, and admin roles
- **Business Profiles**: Rich profiles with media, contact info, and verification
- **Categories & Search**: Organized service categories with advanced filtering
- **Reviews & Ratings**: Customer feedback system with moderation
- **Location-based**: Filter by province and district
- **Admin Dashboard**: User and content management
- **Monetization**: Featured listings and verification badges
- **Multi-language**: English + Kinyarwanda support
- **Mobile-first**: Responsive design optimized for mobile devices

## 🛠 Tech Stack

### Backend
- **Node.js** with Express.js
- **PostgreSQL** database
- **JWT** authentication
- **Redis** for caching and sessions
- **Cloudinary** for image storage
- **Winston** for logging

### Frontend (Web)
- **Next.js** (React framework)
- **Tailwind CSS** for styling
- **Axios** for API calls
- **TypeScript** support

### Mobile
- **React Native** with Expo
- **React Navigation** for routing

### DevOps
- **Docker** containerization
- **Railway** deployment
- **Nginx** reverse proxy

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL 14+
- Redis (optional, for caching)
- npm or yarn
- Git

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd rwanda-service-marketplace
```

### 2. Install dependencies
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install

# Mobile (optional)
cd ../mobile
npm install
```

### 3. Setup environment variables

#### Backend (.env)
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` with your credentials:
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/rwanda_marketplace"

# JWT
JWT_SECRET="your-super-secret-jwt-key-here"

# Redis (optional)
REDIS_URL="redis://localhost:6379"

# Email (optional)
FROM_EMAIL="noreply@servicerw.rw"

# CORS
CORS_ORIGIN="http://localhost:3000"

# Environment
NODE_ENV="development"
PORT=3001
```

#### Frontend (.env.local)
```bash
cd frontend
```

Create `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### 4. Setup database
```bash
cd backend
# Run database migrations and seed data
npm run migrate
npm run seed
```

### 5. Start development servers
```bash
# Backend (Terminal 1)
cd backend
npm run dev

# Frontend (Terminal 2)
cd frontend
npm run dev
```

This will start:
- Backend API on http://localhost:3001
- Frontend web app on http://localhost:3000

### 6. Start mobile app (optional)
```bash
cd mobile
npm start
```

## 📱 Default Accounts

After seeding, you can use these accounts:

**Admin:**
- Email: admin@servicerw.com
- Password: admin123

**Sample Business:**
- Email: kigali.construction@example.com
- Password: password123

## 🏗 Project Structure

```
rwanda-service-marketplace/
├── backend/                 # Express.js API
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── models/          # Data models
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Custom middleware
│   │   ├── services/        # Business logic
│   │   └── utils/           # Utility functions
│   ├── Dockerfile           # Docker configuration
│   └── package.json         # Dependencies
├── frontend/               # Next.js web app
│   ├── components/         # Reusable components
│   ├── pages/              # Next.js pages
│   ├── styles/             # CSS styles
│   ├── utils/              # Utility functions
│   └── package.json        # Dependencies
├── mobile/                 # React Native app
│   ├── screens/            # App screens
│   ├── components/         # Mobile components
│   └── App.js              # Main app file
├── database/               # Database files
│   ├── schema.sql          # Database schema
│   └── seed_data.sql       # Sample data
├── scripts/                # Deployment scripts
├── nginx/                  # Nginx configuration
└── docs/                   # Documentation
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Categories
- `GET /api/categories` - List all categories
- `GET /api/categories/:slug` - Get category details

### Businesses
- `GET /api/businesses` - List businesses (with filters)
- `GET /api/businesses/:slug` - Get business details
- `POST /api/businesses` - Create business profile
- `PUT /api/businesses/:id` - Update business profile

### Reviews
- `GET /api/businesses/:id/reviews` - Get business reviews
- `POST /api/businesses/:id/reviews` - Create review

### Admin
- `GET /api/admin/users` - List all users
- `PUT /api/admin/users/:id` - Update user (ban/verify)
- `GET /api/admin/businesses` - List all businesses
- `PUT /api/admin/businesses/:id` - Update business (verify/feature)

## 🚀 Deployment

See our comprehensive deployment guides:

- **[FREE_DEPLOYMENT.md](docs/FREE_DEPLOYMENT.md)** - Deploy for $0/month
- **[PRODUCTION_DEPLOYMENT.md](docs/PRODUCTION_DEPLOYMENT.md)** - Production setup
- **[SCALING_PLAN.md](docs/SCALING_PLAN.md)** - Scaling to 20,000+ businesses

### Quick Deploy Options

#### Option 1: Railway (Recommended - Free)
```bash
npm install -g @railway/cli
railway login
railway init
railway add postgresql
railway up
```

#### Option 2: Docker
```bash
docker-compose up -d
```

#### Option 3: Vercel + Supabase
```bash
# Deploy frontend to Vercel
cd frontend && vercel

# Setup database on Supabase
# Deploy backend as serverless functions
```

## 💰 Monetization Features

1. **Featured Listings**: Paid placement at top of search results
2. **Verification Badges**: Paid verification for trust building
3. **Premium Profiles**: Enhanced profiles with more media
4. **Category Sponsorship**: Exclusive placement in categories

## 🔧 Development

### Running Tests
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Code Quality
```bash
# Linting
npm run lint

# Type checking (frontend)
cd frontend
npm run type-check
```

## 📊 Performance & Scaling

- **Target**: 20,000+ businesses
- **Expected Load**: 10,000+ concurrent users
- **Database**: Optimized with indexes and caching
- **CDN**: Cloudinary for image optimization
- **Caching**: Redis for session and data caching

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, email info@servicerw.com or create an issue in this repository.

---

**Built with ❤️ for Rwanda's growing real estate industry**
