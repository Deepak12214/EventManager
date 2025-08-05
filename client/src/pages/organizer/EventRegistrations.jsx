import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function EventRegistrations() {
  const { token } = useSelector(state => state.auth);
  const { id: eventId } = useParams();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRegisteredUsers = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/events/${eventId}/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setUsers(data);
      } catch (err) {
        alert('Error: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRegisteredUsers();
  }, [eventId, token]);

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <h2 className="text-2xl font-bold mb-6 text-blue-700 text-center">Registered Users</h2>

      {users.length === 0 ? (
        <p className="text-center text-gray-600">No registrations yet for this event.</p>
      ) : (
        <div className="space-y-4">
          {users.map((u, i) => (
            <div key={i} className="border p-4 rounded bg-white shadow">
              <p className="font-semibold">{u.name}</p>
              <p className="text-sm text-gray-600">{u.email}</p>
              <p className="text-sm text-gray-500">Registered At: {new Date(u.registeredAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
