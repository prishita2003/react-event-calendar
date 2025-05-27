import React from 'react';
import { useDrag } from 'react-dnd';

const recurrenceLabels = {
  daily: ' (Daily)',
  weekly: ' (Weekly)',
  monthly: ' (Monthly)',
  yearly: ' (Yearly)', 
  null: '',
  undefined: '',
};

const EventItem = ({ event, onDelete, onEdit }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'EVENT',
    item: { id: event.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const handleDeleteClick = (e) => {
    e.stopPropagation(); // Prevent triggering parent click
    if (onDelete) onDelete(event.id);
  };

  const handleEditClick = (e) => {
    e.stopPropagation(); // Prevent triggering parent click
    if (onEdit) onEdit(event);
  };

  // Keyboard handlers for buttons to support Enter and Space keys
  const handleKeyDown = (e, action) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action(e);
    }
  };

  return (
    <div
      ref={drag}
      className="flex items-center justify-between bg-blue-100 text-blue-800 px-3 py-1 rounded mb-1 cursor-pointer"
      onClick={(e) => e.stopPropagation()} // Prevent triggering DayCell when clicking inside
      title={`Event: ${event.title}${recurrenceLabels[event.recurrence] || ''}`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      role="listitem"
      tabIndex={-1} // Not focusable, only buttons inside are
    >
      <span className="truncate" aria-label={`Event title: ${event.title}${recurrenceLabels[event.recurrence] || ''}`}>
        {event.title}
        {recurrenceLabels[event.recurrence]}
      </span>
      <div className="flex space-x-2">
        <button
          onClick={handleEditClick}
          onKeyDown={(e) => handleKeyDown(e, handleEditClick)}
          className="text-green-600 hover:text-green-800 font-bold"
          aria-label={`Edit event ${event.title}`}
          tabIndex={0}
          type="button"
        >
          ✎
        </button>
        <button
          onClick={handleDeleteClick}
          onKeyDown={(e) => handleKeyDown(e, handleDeleteClick)}
          className="ml-2 text-red-600 hover:text-red-800 font-bold"
          aria-label={`Delete event ${event.title}`}
          tabIndex={0}
          type="button"
        >
          &#10005;
        </button>
      </div>
    </div>
  );
};

export default EventItem;
