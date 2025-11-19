# RoomEase - Room & Accommodation Rental Platform

A full-stack web application for renting rooms and accommodations. Built with React, Node.js, Express, MongoDB, and Cloudinary for image storage.

## 📋 Features

### Tenant Features
- Browse and search room listings with filters (location, budget, gender preference, amenities)
- View detailed room information with images
- Add/remove listings from favorites
- Real-time messaging with room owners
- Booking and payment integration
- View booking history and confirmations

### Owner Features
- Create and manage room listings with multiple images
- Upload images to Cloudinary
- View pending bookings and inquiries
- Track listing performance with analytics
- Edit/delete listings

### Admin Features
- Approve/reject pending room listings
- Manage user accounts
- View platform analytics and statistics
- Monitor bookings and payments

## 🚀 Tech Stack

**Frontend:**
- React 19
- React Router DOM 7
- Vite 7
- Tailwind CSS 4
- Axios for API calls
- React Icons
- Recharts for analytics
- Socket.io-client for real-time messaging

**Backend:**
- Node.js with Express
- MongoDB with Mongoose ODM
- JWT authentication
- Bcryptjs for password hashing
- Cloudinary for image storage
- Socket.io for real-time communication
- Multer for file uploads
- Express Validator for input validation

## 📦 Installation

### Prerequisites
- Node.js v20+
- MongoDB Atlas account
- Cloudinary account

### Backend Setup

```bash
cd backend
npm install

# Create .env file (copy from .env.example)
# Add your MongoDB URI and Cloudinary credentials
nano .env

# Run backend server
npm run dev
```

Server runs on `http://localhost:5000`

### Frontend Setup

```bash
cd frontend
npm install

# Create .env file (copy from .env.example)
# Set VITE_API_URL to backend URL
nano .env

# Run development server
npm run dev
```

Frontend runs on `http://localhost:5173`

## 🔐 Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

## 🔑 Admin Account Setup

To create an admin account for managing listings:

```bash
cd backend
node create_admin.js
```

Admin credentials:
- Email: `admin@roomease.com`
- Password: `admin123`

## 📝 API Routes

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Listings
- `GET /api/listings` - Get all approved listings with filters
- `GET /api/listings/:id` - Get single listing
- `POST /api/listings` - Create new listing (owner only)
- `PUT /api/listings/:id` - Update listing (owner only)
- `DELETE /api/listings/:id` - Delete listing (owner only)
- `GET /api/listings/owner/my-listings` - Get owner's listings

### Bookings
- `GET /api/bookings` - Get user bookings
- `POST /api/bookings` - Create booking
- `PUT /api/bookings/:id` - Update booking

### Messages
- `GET /api/messages` - Get user messages
- `POST /api/messages` - Send message (uses Socket.io)

### Admin
- `GET /api/admin/listings/pending` - Get pending listings
- `PUT /api/admin/listings/:id/approve` - Approve listing
- `PUT /api/admin/listings/:id/reject` - Reject listing

## 🚀 Deployment

### Deploy Backend (Heroku/Railway/Render)
1. Push code to GitHub
2. Connect repository to hosting platform
3. Set environment variables
4. Deploy

### Deploy Frontend (Vercel/Netlify)
1. Set `VITE_API_URL` to your backend URL
2. Connect repository and deploy

## 📂 Project Structure

```
RoomEase/
├── frontend/
│   ├── src/
│   │   ├── pages/          # All page components
│   │   ├── context/        # React Context (Auth)
│   │   ├── services/       # API service
│   │   ├── App.jsx         # Main app & routing
│   │   └── main.jsx        # Entry point
│   ├── vite.config.js
│   └── tailwind.config.js
│
└── backend/
    ├── config/             # Cloudinary config
    ├── middleware/         # Auth middleware
    ├── models/             # Mongoose schemas
    ├── routes/             # API routes
    ├── server.js           # Express setup
    └── .env                # Environment variables
```

## 🎨 Color Scheme

- **Primary:** Teal (#0d9488)
- **Secondary:** Slate (#0f172a)
- **Accent:** Various grays for UI elements

## 🔄 Real-Time Features

- Live messaging using Socket.io
- Real-time booking notifications
- Live listing updates

## 📊 Database Schema

### Users Collection
- name, email, password (hashed), mobile
- role (tenant/owner/admin)
- favorites (array of listing IDs)
- profilePicture

### Listings Collection
- title, description, type, price
- location (city, area, address)
- images (stored in Cloudinary)
- amenities, gender preference
- occupancy (current, max)
- owner (user reference)
- status (pending/approved/rejected)

### Bookings Collection
- listing (reference)
- tenant (reference)
- checkIn, checkOut dates
- status (pending/active/completed/cancelled)
- totalPrice

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Support

For issues or questions, please create an issue on GitHub.

---

**Happy Renting! 🏠**
