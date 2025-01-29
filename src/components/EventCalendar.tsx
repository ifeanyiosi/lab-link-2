"use client";

import Image from "next/image";
import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

// Example Admin Events for LabLink
const adminEvents = [
  {
    id: 1,
    title: "Appointment with Dr. Smith",
    time: "10:00 AM - 11:00 AM",
    description: "Patient: John Doe. Reason: Annual check-up.",
  },
  {
    id: 2,
    title: "Lab Test Scheduled",
    time: "1:00 PM - 2:00 PM",
    description: "Test: Blood Work. Patient: Jane Doe.",
  },
  {
    id: 3,
    title: "System Maintenance",
    time: "4:00 PM - 6:00 PM",
    description: "Routine server maintenance and updates.",
  },
];

const EventCalendar = () => {
  const [value, onChange] = useState<Value>(new Date());

  return (
    <div className="bg-white w-full p-4 rounded-md shadow-md">
      {/* Calendar Component */}
      <Calendar onChange={onChange} value={value} />

      {/* Events Section */}
      <div className="flex items-center justify-between mt-4">
        <h1 className="text-xl font-semibold">Upcoming Events</h1>
        <Image src="/moreDark.png" alt="More Options" width={20} height={20} />
      </div>

      {/* Event List */}
      <div className="flex flex-col gap-4 mt-4">
        {adminEvents.length > 0 ? (
          adminEvents.map((event) => (
            <div
              className="p-4 rounded-md border border-gray-200 shadow-sm odd:border-t-blue-400 even:border-t-purple-400"
              key={event.id}
            >
              <div className="flex items-center justify-between">
                <h1 className="font-medium text-gray-700">{event.title}</h1>
                <span className="text-gray-500 text-xs">{event.time}</span>
              </div>
              <p className="mt-2 text-gray-500 text-sm">{event.description}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm">
            No events scheduled for this date.
          </p>
        )}
      </div>
    </div>
  );
};

export default EventCalendar;
