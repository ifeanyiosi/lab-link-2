"use client";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { useAuth } from "@/context/AuthContext";
import { Appointment } from "@/components/forms/AppointmentForm";

export default function PatientDashboard() {
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
        const q = query(appointmentsRef, where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);

        const appointmentsData: Appointment[] = [];
        querySnapshot.forEach((doc) => {
          appointmentsData.push(doc.data() as Appointment);
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
  }, [user?.uid]);

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

  const handleTabChange = (
    status: "pending" | "confirmed" | "completed" | "canceled"
  ) => {
    setActiveTab(status);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Your Appointments</h2>

      {/* Tabs for filtering appointments */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => handleTabChange("pending")}
          className={`px-4 py-2 rounded ${
            activeTab === "pending" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => handleTabChange("confirmed")}
          className={`px-4 py-2 rounded ${
            activeTab === "confirmed" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Confirmed
        </button>
        <button
          onClick={() => handleTabChange("completed")}
          className={`px-4 py-2 rounded ${
            activeTab === "completed" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Completed
        </button>
        <button
          onClick={() => handleTabChange("canceled")}
          className={`px-4 py-2 rounded ${
            activeTab === "canceled" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Canceled
        </button>
      </div>

      {/* Loading and error states */}
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Display filtered appointments */}
      {filteredAppointments.length === 0 && !loading && (
        <p>No {activeTab} appointments found.</p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAppointments.map((appointment) => (
          <div key={appointment.labId} className="mb-4 p-4 border rounded">
            <p>
              <strong>Lab ID:</strong> {appointment.labId}
            </p>
            <p>
              <strong>Lab Name:</strong> {appointment.labName}
            </p>
            <p>
              <strong>Date:</strong> {appointment.date}
            </p>
            <p>
              <strong>Time:</strong> {appointment.time}
            </p>
            <p>
              <strong>Tests:</strong> {appointment.tests.join(", ")}
            </p>
            <p>
              <strong>Status:</strong> {appointment.status}
            </p>
            {appointment.notes && (
              <p>
                <strong>Notes:</strong> {appointment.notes}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
