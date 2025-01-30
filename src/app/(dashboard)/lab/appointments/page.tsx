"use client";
import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { useAuth } from "@/context/AuthContext";

export interface Lab {
  id: string;
  email: string;
  labName: string;
  address: string;
  phone: string;
  operatingHours: {
    openingTime: string;
    closingTime: string;
  };
  services: string[];
  state: string;
  town: string;
}

export interface Appointment {
  id?: string;
  userId: string;
  labId: string;
  date: string;
  time: string;
  tests: string[];
  status: "pending" | "confirmed" | "completed" | "canceled";
  notes?: string;
  labName: string;
  patientFirstName: string;
  patientLastName: string;
}

export default function AppointmentsDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<
    Appointment[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [activeTab, setActiveTab] = useState<
    "pending" | "confirmed" | "completed" | "canceled"
  >("pending");

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user?.uid) return;

      setLoading(true);
      setError("");

      try {
        const appointmentsRef = collection(db, "appointments");
        const q =
          user?.role === "lab"
            ? query(appointmentsRef, where("labId", "==", user.uid))
            : query(appointmentsRef, where("userId", "==", user.uid));

        const querySnapshot = await getDocs(q);
        const appointmentsData: Appointment[] = [];
        const labData: Lab[] = [];

        querySnapshot.forEach((doc) => {
          console.log("Fetched Appointment:", doc.id, doc.data());
          appointmentsData.push({ id: doc.id, ...doc.data() } as Appointment);
        });

        setAppointments(appointmentsData);
        filterAppointmentsByStatus(appointmentsData, activeTab);
      } catch (err) {
        setError("Failed to fetch appointments. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [user?.uid, user?.role]);

  useEffect(() => {
    filterAppointmentsByStatus(appointments, activeTab);
  }, [activeTab, appointments]);

  const filterAppointmentsByStatus = (
    appointments: Appointment[],
    status: string
  ) => {
    const filtered = appointments.filter(
      (appointment) => appointment.status === status
    );
    setFilteredAppointments(filtered);
  };

  const handleStatusUpdate = async (
    appointmentId: string,
    newStatus: Appointment["status"]
  ) => {
    try {
      if (!appointmentId) throw new Error("Invalid appointment ID");

      const appointmentRef = doc(db, "appointments", appointmentId);
      await updateDoc(appointmentRef, {
        status: newStatus,
      });

      setAppointments((prev) =>
        prev.map((app) =>
          app.id === appointmentId ? { ...app, status: newStatus } : app
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
      setError("Failed to update appointment status");
    }
  };

  const handleTabChange = (
    status: "pending" | "confirmed" | "completed" | "canceled"
  ) => {
    setActiveTab(status);
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Appointments Management</h2>

      {/* Tabs for filtering appointments */}
      <div className="flex flex-wrap gap-2 mb-6">
        {["pending", "confirmed", "completed", "canceled"].map((status) => (
          <button
            key={status}
            onClick={() => handleTabChange(status as typeof activeTab)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === status
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Loading and error states */}
      {loading && <p className="text-gray-500">Loading appointments...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Display filtered appointments */}
      {filteredAppointments.length === 0 && !loading && (
        <p className="text-gray-500">No {activeTab} appointments found.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAppointments.map((appointment) => (
          <div
            key={appointment.id}
            className="bg-white rounded-xl shadow-sm p-4 border border-gray-100"
          >
            <div className="space-y-2">
              {user?.role === "lab" ? (
                <>
                  <p className="font-medium">
                    Patient Name: {appointment.patientFirstName}
                  </p>
                </>
              ) : (
                <>
                  <p className="font-medium">Lab: {appointment.labName}</p>
                </>
              )}
              <p>Date: {new Date(appointment.date).toLocaleDateString()}</p>
              <p>Time: {appointment.time}</p>
              <p>Tests: {appointment.tests.join(", ")}</p>
              <div className="flex items-center gap-2">
                <span>Status:</span>
                {user?.role === "lab" ? (
                  <select
                    value={appointment.status}
                    onChange={(e) =>
                      handleStatusUpdate(
                        appointment.id!,
                        e.target.value as Appointment["status"]
                      )
                    }
                    className={`px-2 py-1 rounded-md ${
                      appointment.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : appointment.status === "confirmed"
                        ? "bg-green-100 text-green-800"
                        : appointment.status === "completed"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {["pending", "confirmed", "completed", "canceled"].map(
                      (status) => (
                        <option key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                      )
                    )}
                  </select>
                ) : (
                  <span
                    className={`px-2 py-1 rounded-md ${
                      appointment.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : appointment.status === "confirmed"
                        ? "bg-green-100 text-green-800"
                        : appointment.status === "completed"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {appointment.status}
                  </span>
                )}
              </div>
              {appointment.notes && (
                <p className="text-sm text-gray-600">
                  Notes: {appointment.notes}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
