"use client";

import { useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { useAuth } from "@/context/AuthContext"; // Import the useAuth hook
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { CalendarCheck, MapPin } from "lucide-react";

// Define types for the lab object
interface Lab {
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

// Define types for the appointment object
export interface Appointment {
  userId: string; // Assuming you have user authentication
  labId: string; // Lab's email or unique ID
  date: string;
  time: string;
  tests: string[];
  status: "pending" | "confirmed" | "completed" | "canceled";
  notes?: string; // Add notes field
  labName: string; // Add this field
}

// Hardcoded states and towns in Nigeria
const statesAndTowns: { [key: string]: string[] } = {
  Enugu: ["Enugu North", "Enugu South", "Nsukka"],
  Lagos: ["Ikeja", "Lekki", "Victoria Island"],
  Abuja: ["Garki", "Maitama", "Wuse"],
  // Add more states and towns as needed
};

export default function AppointmentForm() {
  const { user } = useAuth(); // Use the useAuth hook to get the current user
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedTown, setSelectedTown] = useState<string>("");
  const [labs, setLabs] = useState<Lab[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [selectedLab, setSelectedLab] = useState<Lab | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [notes, setNotes] = useState<string>("");

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedState(e.target.value);
    setSelectedTown(""); // Reset town when state changes
  };

  const handleTownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTown(e.target.value);
  };

  const handleSearch = async () => {
    if (!selectedState || !selectedTown) {
      setError("Please select both state and town.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const labsRef = collection(db, "users");
      const q = query(
        labsRef,
        where("role", "==", "lab"),
        where("state", "==", selectedState),
        where("town", "==", selectedTown)
      );

      const querySnapshot = await getDocs(q);
      const labsData: Lab[] = [];
      querySnapshot.forEach((doc) => {
        labsData.push(doc.data() as Lab);
      });

      setLabs(labsData);
    } catch (err) {
      setError("Failed to fetch labs. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMakeAppointment = (lab: Lab) => {
    setSelectedLab(lab);
    setIsModalOpen(true);
  };

  const handleTestSelection = (test: string) => {
    if (selectedTests.includes(test)) {
      setSelectedTests(selectedTests.filter((t) => t !== test));
    } else {
      setSelectedTests([...selectedTests, test]);
    }
  };

  const handleSubmitAppointment = async () => {
    if (!selectedLab || !date || !time || selectedTests.length === 0) {
      setError("Please fill out all fields.");
      return;
    }

    const appointment: Appointment = {
      userId: user?.uid || "", // Use the current user's UID
      labId: selectedLab.email,
      date,
      time,
      tests: selectedTests,
      status: "pending",
      notes, // Include notes in the appointment
      labName: selectedLab.labName, // Include lab name
    };

    try {
      const appointmentsRef = collection(db, "appointments");
      await addDoc(appointmentsRef, appointment);
      setIsModalOpen(false);
      setError("");
      alert("Appointment booked successfully!");
    } catch (err) {
      setError("Failed to book appointment. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="py-4 mx-auto">
      <div className="max-w-md flex flex-col gap-y-4">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">State:</label>
          <select
            value={selectedState}
            onChange={handleStateChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Select a state</option>
            {Object.keys(statesAndTowns).map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Town:</label>
          <select
            value={selectedTown}
            onChange={handleTownChange}
            disabled={!selectedState}
            className="w-full p-2 border rounded"
          >
            <option value="">Select a town</option>
            {selectedState &&
              statesAndTowns[selectedState].map((town) => (
                <option key={town} value={town}>
                  {town}
                </option>
              ))}
          </select>
        </div>

        <Button
          onClick={handleSearch}
          disabled={!selectedState || !selectedTown || loading}
          className="w-full  text-white p-2 rounded  "
        >
          {loading ? "Searching..." : "Search Labs"}
        </Button>
      </div>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      <div className="mt-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800">Available Labs</h3>

        {labs.length === 0 && !loading && (
          <p className="text-gray-500 text-center">No labs found.</p>
        )}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {labs.map((lab) => (
            <div
              key={lab.email}
              className="p-5 border rounded-lg shadow-md bg-white transition hover:shadow-lg"
            >
              <h4 className="text-lg font-semibold text-gray-900">
                {lab.labName}
              </h4>
              <p className="text-gray-600">{lab.address}</p>
              <p className="text-sm text-gray-500">📞 {lab.phone}</p>
              <p className="text-sm text-gray-500">
                ⏰ {lab.operatingHours.openingTime} -{" "}
                {lab.operatingHours.closingTime}
              </p>
              <p className="text-sm text-gray-500">
                🧪 Services:{" "}
                <span className="font-medium">{lab.services.join(", ")}</span>
              </p>

              <div className="flex gap-2 mt-4">
                <Button
                  onClick={() => handleMakeAppointment(lab)}
                  className="flex items-center gap-2"
                >
                  <CalendarCheck size={16} />
                  Make Appointment
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {}}
                  className="flex items-center gap-2"
                >
                  <MapPin size={16} />
                  Get Directions
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Appointment Modal */}
      {isModalOpen && selectedLab && (
        <div className="fixed inset-0 z-[500] bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Book Appointment</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                First Name:
              </label>
              <Input
                type="text"
                value={user?.firstName || ""}
                disabled
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Last Name:
              </label>
              <Input
                type="text"
                value={user?.lastName || ""}
                disabled
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Phone:</label>
              <Input
                type="text"
                value={user?.phone || ""}
                disabled
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Date:</label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Time:</label>
              <Input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Tests:</label>
              {selectedLab.services.map((test) => (
                <div key={test} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={test}
                    checked={selectedTests.includes(test)}
                    onChange={() => handleTestSelection(test)}
                  />
                  <label htmlFor={test}>{test}</label>
                </div>
              ))}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Additional Notes:
              </label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleSubmitAppointment}
                className=""
              >
                Submit
              </Button>
              <Button
                onClick={() => setIsModalOpen(false)}
                className=""
                variant={"ghost"}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
