# 🏠 StayBuddy

A full-stack student accommodation booking platform that connects property owners with students looking for off-campus housing. Built with the MERN stack.

---

## 📸 Screenshots

> _Add screenshots here once deployed_

---

## ✨ Features

### For Property Owners
- List, edit, and delete property listings with multi-image upload
- Manage booking requests — confirm or cancel with one click
- Dashboard overview with total listings, bookings, and revenue stats
- Revenue analytics and booking history

### For Students
- Browse and filter properties by location, rent, rooms, and amenities
- Save favourite properties to a personal wishlist
- Book properties and track booking status (pending / confirmed / cancelled)
- Student dashboard with overview, booking history, and saved rooms

### General
- JWT-based authentication with role-based access control
- Separate dashboards for owners and students
- Cloud image storage via Cloudinary
- Fully responsive UI with Tailwind CSS

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite |
| Styling | Tailwind CSS 4 |
| Backend | Node.js + Express 5 |
| Database | MongoDB + Mongoose |
| Auth | JSON Web Tokens (JWT) + bcryptjs |
| File Upload | Multer |
| Media Storage | Cloudinary |
| Dev | Nodemon, dotenv |

---

## 📁 Project Structure

```
StayBuddy/
├── backend/
│   ├── config/
│   │   ├── db.js               # MongoDB connection
│   │   ├── cloudinary.js       # Cloudinary setup
│   │   └── multer.js           # Multer storage config
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── bookingController.js
│   │   ├── propertyController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── authMiddleware.js   # JWT verification
│   │   └── upload.js           # File upload middleware
│   ├── models/
│   │   ├── User.js
│   │   ├── Property.js
│   │   └── Booking.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── bookingRoutes.js
│   │   ├── propertyRoutes.js
│   │   └── userRoutes.js
│   ├── seed.js                 # Database seeder
│   └── server.js
│
└── frontend/
    └── src/
        ├── components/
        │   ├── dashboard/      # Owner dashboard components
        │   ├── student/        # Student dashboard components
        │   ├── Navbar.jsx
        │   ├── Footer.jsx
        │   ├── PropertyCard.jsx
        │   └── FilterSidebar.jsx
        ├── context/
        │   └── AuthContext.jsx
        ├── pages/
        │   ├── Home.jsx
        │   ├── Listings.jsx
        │   ├── PropertyDetails.jsx
        │   ├── Dashboard.jsx
        │   ├── Login.jsx
        │   └── Register.jsx
        ├── services/
        │   └── api.js          # Axios instance
        └── App.jsx
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- A [Cloudinary](https://cloudinary.com/) account

### 1. Clone the repository

```bash
git clone https://github.com/your-username/staybuddy.git
cd staybuddy
```

### 2. Set up the Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Start the backend server:

```bash
# Development (with hot reload)
npm run dev

# Production
npm start
```

The server runs at `http://localhost:5000`.

### 3. Set up the Frontend

```bash
cd ../frontend
npm install
npm run dev
```

The frontend runs at `http://localhost:5173`.

### 4. (Optional) Seed the Database

```bash
cd backend
node seed.js
```

---

## 🔌 API Reference

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new user | Public |
| `POST` | `/api/auth/login` | Login and get JWT | Public |
| `GET` | `/api/properties` | Get all properties | Public |
| `POST` | `/api/properties` | Create a property | Owner |
| `PUT` | `/api/properties/:id` | Update a property | Owner |
| `DELETE` | `/api/properties/:id` | Delete a property | Owner |
| `GET` | `/api/properties/:id` | Get property details | Public |
| `POST` | `/api/bookings` | Create a booking | Student |
| `GET` | `/api/bookings/my` | Get my bookings | Student |
| `PATCH` | `/api/bookings/:id/status` | Update booking status | Owner |
| `GET` | `/api/users/profile` | Get user profile | Any |
| `PUT` | `/api/users/profile` | Update user profile | Any |
| `POST` | `/api/users/save/:propId` | Save/unsave a property | Student |

---

## ⚙️ Environment Variables

| Variable | Description |
|---|---|
| `PORT` | Port for the Express server (default: `5000`) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for signing JWTs |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Your Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Your Cloudinary API secret |

> ⚠️ **Never commit your `.env` file.** Add it to `.gitignore`.

---

## 🗺️ Pages & Routes

| Route | Page | Access |
|---|---|---|
| `/` | Home | Public |
| `/listings` | Property listings with filters | Public |
| `/property/:id` | Property detail & booking | Public |
| `/login` | Login | Public |
| `/register` | Register | Public |
| `/dashboard` | Owner / Student dashboard | Protected |

---

## 🔮 Roadmap

- [ ] Payment gateway integration (Razorpay / Stripe)
- [ ] Real-time chat between owners and students (Socket.io)
- [ ] Geolocation-based property search (Mapbox)
- [ ] Email notifications for booking updates (Nodemailer)
- [ ] Review and rating system
- [ ] Admin moderation panel
- [ ] React Native mobile app

---

## 🤝 Contributing

Contributions are welcome! Please open an issue first to discuss what you'd like to change.

1. Fork the repository
2. Create your branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).

---

## 👤 Author

**Arijit** — [@Dev-Arijit](https://github.com/Dev-Arijit)
