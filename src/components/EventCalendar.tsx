import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Image from "next/image";
import { format } from "date-fns";
import {
  Clock,
  MapPin,
  TestTube2,
  Scan,
  Calendar as CalendarIcon,
} from "lucide-react";


type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

interface Event {
  id: string;
  title: string;
  time: string;
  description: string;
  date?: string;
  type?: string;
  status?: string;
}

const EventCalendar = () => {
  const [value, onChange] = useState<Value>(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const events: Event[] = [
    {
      id: "1",
      title: "Blood Test Appointment",
      time: "10:00 AM",
      description: "Complete blood count (CBC) and lipid profile",
      type: "test",
      status: "confirmed",
    },
    {
      id: "2",
      title: "MRI Scan",
      time: "2:30 PM",
      description: "Full body MRI scan with contrast",
      type: "scan",
      status: "pending",
    },
  ];

  const handleDateChange = (date: Value) => {
    onChange(date);
    if (date instanceof Date) {
      setSelectedDate(date);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Health Calendar
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {format(selectedDate, "EEEE, MMMM d, yyyy")}
            </p>
          </div>
          <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
            <Image
              src="/moreDark.png"
              alt="More Options"
              width={24}
              height={24}
              className="opacity-75 hover:opacity-100"
            />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row">
        {/* Calendar Section */}
        

        {/* Events Section */}
        <div className="lg:w-1/2 p-6 bg-gray-50">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Daily Schedule
            </h3>
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="w-4 h-4 mr-1" />
              <span>{events.length} appointments</span>
            </div>
          </div>

          <div className="space-y-4 h-[500px] overflow-y-auto pr-2">
            {events.map((event) => (
              <div
                key={event.id}
                className="group p-5 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 hover:border-blue-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        event.type === "test" ? "bg-red-100" : "bg-purple-100"
                      }`}
                    >
                      {event.type === "test" ? (
                        <TestTube2 className="w-5 h-5 text-red-600" />
                      ) : (
                        <Scan className="w-5 h-5 text-purple-600" />
                      )}
                    </div>
                    <h4 className="font-semibold text-gray-900">
                      {event.title}
                    </h4>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      event.status || ""
                    )}`}
                  >
                    {event.status}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-4">
                  {event.description}
                </p>

                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>Tesla Medical Center</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCalendar;
