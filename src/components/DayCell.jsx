import React from 'react';
import { format, isToday } from 'date-fns';
import { useDrop } from 'react-dnd';
import EventItem from './EventItem';

const DayCell = ({
  date,
  onClick,
  events = [],
  deleteEvent,
  onEdit,
  onDropEvent,
  isCurrentMonth = true,
}) => {
  const isTodayDate = isToday(date);

  // Drop target to accept dragged events
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: 'EVENT',
    drop: (item) => {
      onDropEvent(item.id, date);
    },
    canDrop: () => true,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }), [date, onDropEvent]);

  const filteredEvents = events.filter((event) => {
    const eventDate = new Date(event.date);
    const eventDay = format(eventDate, 'yyyy-MM-dd');
    const currentDay = format(date, 'yyyy-MM-dd');

    if (eventDay === currentDay) return true;

    if (!event.recurrence) return false;

    switch (event.recurrence) {
      case 'daily':
        return eventDate <= date;
      case 'weekly':
        return (
          eventDate <= date &&
          format(eventDate, 'i') === format(date, 'i')
        );
      case 'monthly':
        return eventDate <= date && eventDate.getDate() === date.getDate();
      case 'yearly':
        return (
          eventDate <= date &&
          eventDate.getDate() === date.getDate() &&
          eventDate.getMonth() === date.getMonth()
        );
      default:
        return false;
    }
  });

  return (
    <div
      ref={drop}
      className={`border p-2 rounded text-center cursor-pointer min-h-[80px] ${
        isTodayDate ? 'bg-blue-100 text-blue-600 font-bold' : ''
      } ${isOver && canDrop ? 'bg-green-100 border-green-400' : ''} ${
        !isCurrentMonth ? 'text-gray-400' : ''
      }`}
      onClick={() => onClick(date)}
    >
      <div>{format(date, 'd')}</div>
      <div className="mt-1 space-y-1">
        {filteredEvents.map((event) => (
          <EventItem
            key={event.id}
            event={event}
            onDelete={() => deleteEvent(event.id)}
            onEdit={() => onEdit(event)}
          />
        ))}
      </div>
    </div>
  );
};

export default DayCell;
