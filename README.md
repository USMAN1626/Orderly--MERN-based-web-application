# 🏨 AUA Hotel App

AUA Hotel App is a MER-based mobile application that allows users to browse hotel listings, book rooms, and manage their bookings and profile with ease.

---

## 📸 Deployment

Visit live link to check  UI:

https://a-u-a-hotel-app.vercel.app

---


## 📱 Features

- 🏠 Home screen with available rooms
- 🛏️ View detailed room descriptions
- 📅 Book hotel rooms with check-in/out date
- 💳 Booking confirmation & payment screen
- 👤 User login and signup
- 🧾 View profile and booking history

---

## 📂 Project Structure

```
/mern-hotel-app
│
├── backend/
│   ├── config/               # DB config, env variables
│   ├── controllers/          # Logic for users, rooms, bookings
│   ├── models/               # Mongoose schemas: User, Room, Booking
│   ├── routes/               # Express routes: /api/users, /api/rooms, /api/bookings
│   ├── middleware/           # Auth middleware, error handling
│   └── server.js             # Express app entry point
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/       # UI components: Navbar, RoomCard, BookingForm
│   │   ├── pages/            # Pages: Home, Login, Signup, RoomDetails, Bookings, Profile
│   │   ├── context/          # React context or Redux store
│   │   ├── utils/            # Helper functions, API calls
│   │   └── App.js            # Main app component with routing
│   └── package.json
│
└── README.md

```
---

## 🚀 Getting Started

### ✅ Prerequisites

- [Node.js](https://nodejs.org/en/download/)
- [MongoDB](https://www.mongodb.com/try/download/community) (local or Atlas)
- [npm](https://www.npmjs.com/get-npm) or [yarn](https://yarnpkg.com/getting-started/install)

### Backend Setup

```bash
cd backend
npm install
npm run dev           # Starts server with nodemon

now
Create .env file in backend/ with:
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

## Frontend Setup
```bash
cd frontend
npm install
npm start             # Runs React app on http://localhost:3000

```

🛠️ Technologies Used

Backend: Node.js, Express, MongoDB, Mongoose, JWT

Frontend: React, React Router, Context API or Redux, Axios

Others: dotenv, bcryptjs, nodemon


## 👤 Author

**Muhammad Usman**  
GitHub: [@USMAN1626](https://github.com/USMAN1626)

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
