import AppointmentForm from "@/components/forms/AppointmentForm";
import React from "react";

export default function page() {
  return (
    <div className="min-h-screen bg-gray-100 lg:py-8 px-4 lg:px-8 lg:max-w-7xl">
      <div className="flex flex-col gap-4 py-4">
        <h1 className="text-3xl font-bold text-start mb-6">
          Find a Lab - Search Results
        </h1>

        <p className="text-gray-600">
          To make an appointment or get detailed lab information use the search
          below. Walk-ins are also welcome. When visiting a lab, you should
          bring the LabCorp test request form from a health care professional
          requesting the laboratory testing.
        </p>

        <p className="text-gray-600">Not all locations offer all services.</p>
      </div>
      <AppointmentForm />
    </div>
  );
}
