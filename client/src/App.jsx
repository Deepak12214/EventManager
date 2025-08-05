import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "./redux/slices/authSlice";

// Pages
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import Dashboard from "./pages/dashboard/Dashboard.jsx";
import CreateEvent from "./pages/organizer/CreateEvent.jsx";
import EventBrowser from "./pages/user/EventBrowser.jsx";
import MyRegistrations from "./pages/user/MyRegistrations.jsx";
import EventRegistrations from "./pages/organizer/EventRegistrations.jsx";
import MyEvents from "./pages/organizer/MyEvents.jsx";
import EditEvent from './pages/organizer/EditEvent.jsx';


// Guard
import PrivateRoute from "./components/auth/PrivateRoute.jsx";

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (token && user) {
      dispatch(setCredentials({ token, user: JSON.parse(user) }));
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/my-events"
          element={
            <PrivateRoute>
              <MyEvents />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/create-event"
          element={
            <PrivateRoute>
              <CreateEvent />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/events"
          element={
            <PrivateRoute>
              <EventBrowser />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/event/:id/edit"
          element={
            <PrivateRoute>
              <EditEvent />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/registrations"
          element={
            <PrivateRoute>
              <MyRegistrations />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/event/:id/registrations"
          element={
            <PrivateRoute>
              <EventRegistrations />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}
