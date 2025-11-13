import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import dayjs from 'dayjs';

function DatePicker({ onDateSelect }) {
  const [date, setDate] = useState(new Date());

  const handleChange = (selectedDate) => {
    setDate(selectedDate);
    onDateSelect(selectedDate);
  };

  return (
    <div className="date-picker">
      <Calendar onChange={handleChange} value={date} />
      <div className="mt-3 text-center">
        <p className="text-sm text-gray-700 font-medium">
          Selected Date: {dayjs(date).format('MMMM D, YYYY')}
        </p>
      </div>
    </div>
  );
}

export default DatePicker;

