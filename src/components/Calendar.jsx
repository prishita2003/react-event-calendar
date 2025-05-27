import React, { useState } from 'react';
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  addMonths,
  subMonths,
  format,
  addDays,
  isSameMonth,
} from 'date-fns';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DayCell from './DayCell';
import EventForm from './EventForm';

const Calendar = ({ events, addEvent, deleteEvent, updateEvent }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);

  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 }); // Week starts Monday
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  // Weekday labels Monday to Sunday
  const weekdays = Array.from({ length: 7 }).map((_, i) =>
    format(addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), i), 'EEE')
  );

  const handleDayClick = (date) => {
    setSelectedDate(date);
    setEditingEvent(null);
  };

  const handleSaveEvent = (eventData) => {
    if (eventData.id) {
      updateEvent(eventData);
      setEditingEvent(null);
    } else {
      addEvent(eventData);
    }
    setSelectedDate(null);
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setSelectedDate(null);
  };

  const handleCloseForm = () => {
    setSelectedDate(null);
    setEditingEvent(null);
  };

  const handleDropEvent = (eventId, newDate) => {
    const eventToUpdate = events.find((ev) => ev.id === eventId);
    if (eventToUpdate) {
      updateEvent({ ...eventToUpdate, date: newDate.toISOString() });
    }
  };

  const goToPrevMonth = () => {
    setCurrentMonth((prev) => subMonths(prev, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth((prev) => addMonths(prev, 1));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex justify-between items-center p-4">
        <button
          onClick={goToPrevMonth}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter') goToPrevMonth();
          }}
          className="px-4 py-2 bg-gray-200 rounded"
          aria-label="Go to previous month"
        >
          ⬅️ Prev
        </button>
        <h2 className="text-xl font-bold" aria-live="polite">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <button
          onClick={goToNextMonth}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter') goToNextMonth();
          }}
          className="px-4 py-2 bg-gray-200 rounded"
          aria-label="Go to next month"
        >
          Next ➡️
        </button>
      </div>

      {/* Weekday labels */}
      <div className="grid grid-cols-7 gap-2 px-4 text-center font-semibold" role="row">
        {weekdays.map((day) => (
          <div key={day} role="columnheader">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar days grid */}
      <div className="grid grid-cols-7 gap-2 p-4" role="grid" aria-label="Calendar days">
        {days.map((day) => (
          <DayCell
            key={day.toISOString()}
            date={day}
            onClick={handleDayClick}
            events={events}
            deleteEvent={deleteEvent}
            onEdit={handleEditEvent}
            onDropEvent={handleDropEvent}
            isCurrentMonth={isSameMonth(day, currentMonth)}
          />
        ))}
      </div>

      {(selectedDate || editingEvent) && (
        <EventForm
          selectedDate={selectedDate}
          event={editingEvent}
          onSave={handleSaveEvent}
          onClose={handleCloseForm}
        />
      )}
    </DndProvider>
  );
};

export default Calendar;
