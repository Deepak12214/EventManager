import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

export default function EventBrowser() {
  const { token, user } = useSelector(state => state.auth);
  const [events, setEvents] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/events', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        setEvents(data);
        setRegisteredEvents(data
          .filter(e => e.registeredUsers?.includes(user.id))
          .map(e => e._id));
      });
  }, [token]);

  useEffect(() => {
    socket.on('newRegistration', ({ eventId }) => {
      setEvents(prev =>
        prev.map(event =>
          event._id === eventId
            ? { ...event, registeredCount: (event.registeredCount || 0) + 1 }
            : event
        )
      );
    });

    return () => socket.off('newRegistration');
  }, []);

  const handleRegister = (eventId) => {
    fetch(`http://localhost:5000/api/events/${eventId}/register`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        setRegisteredEvents(prev => [...prev, eventId]);
      });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto mt-10 px-4">
      {events.map(event => {
        const isRegistered = registeredEvents.includes(event._id);
        const registered = event.registeredCount || 0;
        const full = registered >= event.capacity;

        return (
          <div key={event._id} className="border p-4 rounded shadow bg-white">
            <h3 className="text-xl font-bold">{event.title}</h3>
            <p className="text-gray-600">{event.description}</p>
            <p className="text-sm mt-2">📍 {event.location} | 📅 {new Date(event.date).toLocaleDateString()}</p>
            <p className="text-sm mt-1">Capacity: {event.capacity}</p>
            <p className="text-sm text-blue-700 mt-1">Registered: {registered} / {event.capacity}</p>

            <button
              onClick={() => handleRegister(event._id)}
              disabled={isRegistered || full}
              className={`mt-4 w-full py-2 rounded text-white transition ${
                isRegistered || full ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isRegistered ? 'Registered' : full ? 'Full' : 'Register'}
            </button>
          </div>
        );
      })}
    </div>
  );
}
