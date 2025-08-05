import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export default function MyRegistrations() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useSelector(state => state.auth);

  useEffect(() => {
    const fetchMyRegistrations = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/events/my/registrations', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setEvents(data);
      } catch (err) {
        alert('Error: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMyRegistrations();
  }, [token]);

  if (loading) return <div className="text-center mt-10">Loading your registrations...</div>;

  return (
    <div className="max-w-5xl mx-auto mt-8 px-4">
      <h2 className="text-2xl font-bold mb-6 text-center text-purple-700">My Registered Events</h2>

      {events.length === 0 ? (
        <p className="text-center text-gray-600">You haven’t registered for any events yet.</p>
      ) : (
        <div className="grid gap-6">
         {events.map(event => {
  if (!event) return null;
  return (
    <div key={event._id} className="border rounded p-4 shadow bg-white">
      <h3 className="text-xl font-semibold">{event.title}</h3>
      <p className="text-gray-700 mt-1">{event.description}</p>
      <p className="text-sm text-gray-500 mt-2">
        📍 {event.location} | 📅 {new Date(event.date).toLocaleDateString()}
      </p>
      <p className="text-sm">Capacity: {event.capacity}</p>
    </div>
  );
})}
        </div>
      )}
    </div>
  );
}
