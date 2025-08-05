import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function MyEvents() {
  const { token, user } = useSelector(state => state.auth);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchMyEvents = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/events/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      const ownEvents = data.filter(event => event.createdBy === user.id);
      setEvents(ownEvents);
    } catch (err) {
      alert('Failed to load your events: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyEvents();
  }, [token, user]);

  const handleDelete = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this event?');
    if (!confirm) return;

    try {
      const res = await fetch(`http://localhost:5000/api/events/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setEvents(prev => prev.filter(event => event._id !== id));
      alert('Event deleted successfully!');
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  if (loading) return <div className="text-center mt-10">Loading your events...</div>;

  return (
    <div className="max-w-5xl mx-auto mt-8 px-4">
      <h2 className="text-2xl font-bold mb-6 text-center text-green-700">My Created Events</h2>

      {events.length === 0 ? (
        <p className="text-center text-gray-600">You haven’t created any events yet.</p>
      ) : (
        <div className="grid gap-6">
          {events.map(event => (
            <div key={event._id} className="border rounded p-4 shadow bg-white">
              <h3 className="text-xl font-semibold">{event.title}</h3>
              <p className="text-gray-700 mt-1">{event.description}</p>
              <p className="text-sm text-gray-500 mt-2">
                📍 {event.location} | 📅 {new Date(event.date).toLocaleDateString()}
              </p>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => navigate(`/dashboard/event/${event._id}/registrations`)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  View Registrations
                </button>

                <button
                  onClick={() => navigate(`/dashboard/event/${event._id}/edit`)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(event._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
