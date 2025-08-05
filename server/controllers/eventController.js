import Event from '../models/Event.js';
import Registration from '../models/Registration.js';


export const createEvent = async (req, res) => {
  try {
    const { title, description, date, location, capacity } = req.body;
    const newEvent = await Event.create({
      title,
      description,
      date,
      location,
      capacity,
      createdBy: req.user.userId,
    });

    res.status(201).json(newEvent);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create event' });
  }
};


export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().lean();

    const withUsers = await Promise.all(events.map(async (event) => {
      const registrations = await Registration.find({ eventId: event._id }).lean();
      const registeredUsers = registrations.map(r => r.userId.toString());
      return {
        ...event,
        registeredCount: registeredUsers.length,
        registeredUsers,
      };
    }));

    res.json(withUsers);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load events' });
  }
};


export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving event' });
  }
};


export const registerForEvent = (req, res) => {
  const { id: eventId } = req.params;
  const userId = req.user.userId;

  Registration.findOne({ userId, eventId }).then((alreadyRegistered) => {
    if (alreadyRegistered) {
      return res.status(400).json({ message: 'Already registered' });
    }

    return Registration.create({ userId, eventId, registeredAt: new Date() }).then((registration) => {
      const io = req.app.get('io');
      io.emit('newRegistration', { eventId, user: registration });

      res.status(200).json({ message: 'Registration successful' });
    });
  }).catch((err) => {
    res.status(500).json({ message: 'Failed to register for event' });
  });
};


export const getRegisteredUsersForEvent = async (req, res) => {
  try {
    const eventId = req.params.id;

    const registrations = await Registration.find({ eventId })
      .populate('userId', 'name email role');

    const users = registrations.map(r => ({
      name: r.userId.name,
      email: r.userId.email,
      role: r.userId.role,
      registeredAt: r.registeredAt,
    }));

    res.json(users);
  } catch (err) {
    console.error('Get Registered Users Error:', err);
    res.status(500).json({ message: 'Failed to fetch registered users' });
  }
};

// View all registered events
export const getUserRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({ userId: req.user.userId })
      .populate('eventId');

    const events = registrations.map(r => r.eventId);
    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch your registrations' });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (event.createdBy.toString() !== req.user.userId)
      return res.status(403).json({ message: 'Not authorized' });

    Object.assign(event, req.body);
    await event.save();

    res.json({ message: 'Event updated successfully', event });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (event.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Unauthorized to delete this event' });
    }

    await event.deleteOne();

    res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    console.error('Delete Error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};