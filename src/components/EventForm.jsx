import React, { useState, useEffect, useRef } from 'react';

const EventForm = ({ selectedDate, event, onSave, onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [time, setTime] = useState('');
  const [recurrence, setRecurrence] = useState('none');

  const titleInputRef = useRef(null);

  useEffect(() => {
    if (event) {
      setTitle(event.title || '');
      setDescription(event.description || '');
      setTime(event.time || '');
      setRecurrence(event.recurrence || 'none');
    } else {
      setTitle('');
      setDescription('');
      setTime('');
      setRecurrence('none');
    }
    // Focus title input when form opens
    setTimeout(() => {
      titleInputRef.current?.focus();
    }, 0);
  }, [event]);

  const handleSubmit = (e) => {
    e.preventDefault();

    onSave({
      title,
      description,
      date: event ? event.date : selectedDate,
      time,
      recurrence: recurrence === 'none' ? null : recurrence,
      id: event ? event.id : undefined,
    });

    onClose();
  };

  // Handle ESC key to close modal
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="event-form-title"
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-md"
      >
        <h2 id="event-form-title" className="text-lg font-semibold mb-4">
          {event ? 'Edit Event' : 'Add Event'}
        </h2>

        <div className="mb-2">
          <label htmlFor="title" className="block text-sm font-medium">
            Title
          </label>
          <input
            id="title"
            ref={titleInputRef}
            className="border w-full p-2 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            aria-required="true"
          />
        </div>

        <div className="mb-2">
          <label htmlFor="time" className="block text-sm font-medium">
            Time
          </label>
          <input
            id="time"
            type="time"
            className="border w-full p-2 rounded"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>

        <div className="mb-2">
          <label htmlFor="description" className="block text-sm font-medium">
            Description
          </label>
          <textarea
            id="description"
            className="border w-full p-2 rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="mb-2">
          <label htmlFor="recurrence" className="block text-sm font-medium">
            Recurrence
          </label>
          <select
            id="recurrence"
            className="border w-full p-2 rounded"
            value={recurrence}
            onChange={(e) => setRecurrence(e.target.value)}
          >
            <option value="none">None</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            className="px-4 py-2 bg-gray-200 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;

