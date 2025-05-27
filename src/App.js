import React from 'react';
import Calendar from './components/Calendar';
import useEvents from './hooks/useEvents';

function App() {
  const { events, addEvent, deleteEvent, updateEvent } = useEvents();

  return (
    <div className="min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold text-center p-4">Event Calendar</h1>
      <Calendar 
        events={events} 
        addEvent={addEvent} 
        deleteEvent={deleteEvent} 
        updateEvent={updateEvent} 
      />
    </div>
  );
}

export default App;
