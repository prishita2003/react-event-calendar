import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const LOCAL_STORAGE_KEY = 'eventCalendarEvents';

const useEvents = () => {
  const [events, setEvents] = useState(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Failed to parse stored events', e);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(events));
  }, [events]);

  const addEvent = (event) => {
  const newEvent = { ...event, id: uuidv4(), recurrence: event.recurrence || null };
  setEvents((prev) => [...prev, newEvent]);
};


  const deleteEvent = (id) => {
    setEvents((prev) => prev.filter((event) => event.id !== id));
  };

  const updateEvent = (updated) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === updated.id ? updated : e))
    );
  };

  return { events, addEvent, deleteEvent, updateEvent };
};

export default useEvents;
