import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../redux/slices/authSlice.js';
import { useEffect } from 'react';

export default function Dashboard() {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate('/');
  }, [user]);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };
  if (!user) return null;

  return (
    <div className="min-h-screen p-6 bg-gray-100">
          <div className="flex justify-between items-center p-4 bg-gray-100 shadow">
            <h1 className="text-2xl font-bold mb-6 text-blue-600">
        Welcome, {user.name} ({user.role})
      </h1> 
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
      >
        Logout
      </button>
    </div>

      {user.role === 'organizer' ? (
        <div className="space-y-4">
          <button
            onClick={() => navigate('/dashboard/create-event')}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            ➕ Create New Event
          </button>
          <button
            onClick={() => navigate('/dashboard/my-events')}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            📋 Manage My Events
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <button
            onClick={() => navigate('/dashboard/events')}
            className="bg-indigo-600 text-white px-4 py-2 rounded"
          >
            🔍 Browse Events
          </button>
          <button
            onClick={() => navigate('/dashboard/registrations')}
            className="bg-purple-600 text-white px-4 py-2 rounded"
          >
            📝 My Registrations
          </button>
        </div>
      )}
    </div>
  );
}
