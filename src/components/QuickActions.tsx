import Link from "next/link";
import React from "react";

export default function QuickActions() {
  return (
    <div className="bg-white py-4 rounded-md">
      <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500">
        <Link
          className="p-3 rounded-md bg-blue-100"
          href="/patient/appointment/create-appointment"
        >
          Make an Appointment
        </Link>
        <Link className="p-3 rounded-md bg-green-100" href="/labs/reports">
          View Results
        </Link>
        <Link
          className="p-3 rounded-md bg-yellow-100"
          href="/patient/appointment/appointments"
        >
          Manage Appointments
        </Link>

        <Link className="p-3 rounded-md bg-blue-100" href="/list/labs">
          Avaliable Labs
        </Link>
        <Link className="p-3 rounded-md bg-green-100" href="/labs/reports">
          Consult a Doctor
        </Link>
      </div>
    </div>
  );
}
