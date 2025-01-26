"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { db } from "@/firebase/firebaseConfig";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";

const MakeAppointment = () => {
  const { user } = useAuth();
  const [appointmentDate, setAppointmentDate] = useState<Date | undefined>();
  const [appointmentTime, setAppointmentTime] = useState<string>(""); // Added time state
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!appointmentDate || !appointmentTime) {
      alert("Please select both appointment date and time.");
      return;
    }

    setLoading(true);

    try {
      // Combine date and time into a single Date object
      const [hours, minutes] = appointmentTime.split(":").map(Number);
      const fullAppointmentDate = new Date(appointmentDate);
      fullAppointmentDate.setHours(hours, minutes);

      const appointmentData = {
        uid: user?.uid,
        appointmentDate: Timestamp.fromDate(fullAppointmentDate),
        notes,
        status: "Scheduled",
        createdAt: Timestamp.now(),
      };

      await addDoc(collection(db, "appointments"), appointmentData);
      alert("Appointment created successfully!");
      router.push("/appointments");
    } catch (error) {
      console.error("Error creating appointment:", error);
      alert("Failed to create appointment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Make an Appointment</h1>
      <div className="space-y-6">
        <div>
          <Label htmlFor="date" className="block mb-2 font-medium">
            Appointment Date
          </Label>
          <Calendar
            selected={appointmentDate}
            onSelect={(date) => setAppointmentDate(date)} // Ensure date is set here
            mode="single"
            className="border rounded p-4"
          />
        </div>

        <div>
          <Label htmlFor="time" className="block mb-2 font-medium">
            Appointment Time
          </Label>
          <input
            type="time"
            id="time"
            value={appointmentTime}
            onChange={(e) => setAppointmentTime(e.target.value)}
            className="border rounded p-2"
          />
        </div>

        <div>
          <Label htmlFor="notes" className="block mb-2 font-medium">
            Notes
          </Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any relevant details here..."
          />
        </div>

        <Button
          disabled={loading}
          onClick={handleSubmit}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white"
        >
          {loading ? "Creating..." : "Create Appointment"}
        </Button>
      </div>
    </div>
  );
};

export default MakeAppointment;
