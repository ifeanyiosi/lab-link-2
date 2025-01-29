// components/AppointmentModal.tsx

import React, { useState } from "react";
import { Timestamp } from "firebase/firestore";
import { Button, Input, DatePicker, TimePicker, Select } from "shadcn"; // Example, customize with your button etc.

interface AppointmentModalProps {
  lab: Lab;
  userId: string;
  userName: string;
  onClose: () => void;
}

const AppointmentModal = ({
  lab,
  userId,
  userName,
  onClose,
}: AppointmentModalProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const handleSubmit = async () => {
    // Handle submitting the appointment here, including the userId, userName, etc.
    // You might call Firebase functions to save the appointment data

    // For example:
    // await addDoc(appointmentsRef, {
    //   labId: lab.id,
    //   userId,
    //   userName,
    //   selectedDate: Timestamp.fromDate(selectedDate),
    //   selectedTime,
    //   selectedServices,
    // });

    onClose(); // Close modal after submission
  };

  return (
    <div>
      <h2>Make an Appointment</h2>
      <p>Lab: {lab.labName}</p>
      <div>
        <h3>Select Services</h3>
        <Select
          value={selectedServices}
          onChange={(value) => setSelectedServices(value)}
          multiple
        >
          {lab.services.map((service) => (
            <Select.Option key={service} value={service}>
              {service}
            </Select.Option>
          ))}
        </Select>
      </div>

      <div>
        <h3>Select Date</h3>
        <DatePicker
          value={selectedDate}
          onChange={(date) => setSelectedDate(date)}
        />
      </div>

      <div>
        <h3>Select Time</h3>
        <TimePicker
          value={selectedTime}
          onChange={(time) => setSelectedTime(time)}
        />
      </div>

      <Button onClick={handleSubmit}>Submit Appointment</Button>
      <Button onClick={onClose}>Close</Button>
    </div>
  );
};

export default AppointmentModal;
