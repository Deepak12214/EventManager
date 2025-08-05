# 🎉 Event Management Dashboard (MERN Stack)

A full-featured role-based event management system built using the MERN stack (MongoDB, Express, React, Node.js).

## 👥 Roles

- **User**  
  - Browse upcoming events  
  - Register for events  
  - View “My Registrations”

- **Organizer**  
  - Create new events  
  - View “My Events”  
  - View registered users per event

---

## 🚀 Features

- ✅ Role-based login/register
- ✅ JWT authentication
- ✅ Persistent login using Redux Toolkit + localStorage
- ✅ Route protection via `PrivateRoute`
- ✅ Event creation and listing
- ✅ Event registration with duplicate prevention
- ✅ Organizer-only user registration view
- ✅ My Events / My Registrations views
- ✅ Clean TailwindCSS UI

---

## 🧰 Tech Stack

| Layer        | Tech                   |
|--------------|------------------------|
| Frontend     | React + Vite + Redux Toolkit + TailwindCSS |
| Backend      | Node.js + Express      |
| Database     | MongoDB + Mongoose     |
| Auth         | JWT + bcryptjs         |
| State Mgmt   | Redux Toolkit          |
| Styling      | TailwindCSS            |

---

## 📁 Folder Structure

project-root/
├── client/ # Frontend (React)
│ ├── src/
│ │ ├── pages/
│ │ ├── redux/
│ │ ├── components/
│ │ └── App.jsx
├── server/ # Backend (Express + MongoDB)
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ └── server.js


💻 Frontend Setup
cd client
npm install
npm run dev

💻 Backend Setup
cd server
npm install
npm run dev







📦 API Endpoints
🔐 Auth
POST /api/auth/register

POST /api/auth/login

📅 Events
GET /api/events

POST /api/events (organizer only)

POST /api/events/:id/register (user only)

GET /api/events/my/registrations

GET /api/events/:id/users