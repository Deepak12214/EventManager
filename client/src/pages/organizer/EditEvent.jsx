import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function EditEvent() {
  const { id } = useParams();
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/events/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        setEventData({
          title: data.title,
          description: data.description,
          location: data.location,
          date: data.date.split('T')[0], // format for input
        });
      } catch (err) {
        alert('Failed to load event: ' + err.message);
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, token]);

  const handleChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5000/api/events/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(eventData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      alert('Event updated successfully!');
      navigate('/dashboard/my-events'); 
    } catch (err) {
      alert('Update failed: ' + err.message);
    }
  };

  if (loading) return <div className="text-center mt-10">Loading event data...</div>;

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4 text-center text-blue-700">Edit Event</h2>
      <form onSubmit={handleUpdate} className="grid gap-4">
        <input
          type="text"
          name="title"
          value={eventData.title}
          onChange={handleChange}
          placeholder="Title"
          className="p-2 border rounded"
          required
        />
        <textarea
          name="description"
          value={eventData.description}
          onChange={handleChange}
          placeholder="Description"
          className="p-2 border rounded"
          rows={4}
          required
        />
        <input
          type="text"
          name="location"
          value={eventData.location}
          onChange={handleChange}
          placeholder="Location"
          className="p-2 border rounded"
          required
        />
        <input
          type="date"
          name="date"
          value={eventData.date}
          onChange={handleChange}
          className="p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Update Event
        </button>
      </form>
    </div>
  );
}
