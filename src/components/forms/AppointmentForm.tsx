"use client";

import { useState } from "react";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { useAuth } from "@/context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import {
  CalendarCheck,
  MapPin,
  Search,
  Clock,
  Phone,
  Building2,
  Beaker,
} from "lucide-react";
import { statesAndTowns } from "@/lib/constants";

export interface LabService {
  id: string;
  name: string;
  description: string;
  labPrice: number;
  details: {
    sampleType: string;
    collectionMethod: string;
    resultsTimeframe: string;
    preparation: string;
  };
}

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
  services: LabService[];
  state: string;
  town: string;
}

export interface Appointment {
  userId: string;
  labId: string;
  date: string;
  time: string;
  tests: Array<{
    name: string;
    price: number;
  }>;
  status: "pending" | "confirmed" | "completed" | "canceled";
  notes?: string;
  labName: string;
  patientFirstName: string;
  patientLastName: string;
}

export default function AppointmentForm() {
  const { user } = useAuth();
  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedTown, setSelectedTown] = useState("");
  const [labs, setLabs] = useState<Lab[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedLab, setSelectedLab] = useState<Lab | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);

  const handleSearch = async () => {
    if (!selectedState || !selectedTown) {
      toast.error("Please select both state and town.");
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

      for (const doc of querySnapshot.docs) {
        const labData = doc.data() as Omit<Lab, "id" | "services">;
        const servicesCol = collection(db, "users", doc.id, "lab-services");
        const servicesSnapshot = await getDocs(servicesCol);

        const services = servicesSnapshot.docs.map((serviceDoc) => ({
          id: serviceDoc.id,
          ...serviceDoc.data(),
        })) as LabService[];

        labsData.push({
          id: doc.id,
          ...labData,
          services: services,
        });
      }

      setLabs(labsData);
      if (labsData.length === 0) {
        toast.info("No labs found in this location.");
      }
    } catch (err) {
      toast.error("Failed to fetch labs. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAppointment = async () => {
    if (!selectedLab || !date || !time || selectedTests.length === 0) {
      toast.error("Please fill out all required fields.");
      return;
    }

    setBookingLoading(true);

    try {
      const appointment: Appointment = {
        userId: user?.uid || "",
        labId: selectedLab.id,
        date,
        time,
        tests: selectedTests.map((testName) => {
          const service = selectedLab.services.find((s) => s.name === testName);
          return {
            name: testName,
            price: service?.labPrice || 0,
          };
        }),
        status: "pending",
        notes,
        labName: selectedLab.labName,
        patientFirstName: user?.firstName || "",
        patientLastName: user?.lastName || "",
      };

      await addDoc(collection(db, "appointments"), appointment);
      toast.success("Appointment booked successfully!");
      setIsModalOpen(false);
      setSelectedTests([]);
      setNotes("");
      setDate("");
      setTime("");
    } catch (err) {
      toast.error("Failed to book appointment. Please try again.");
      console.error(err);
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <ToastContainer
        theme="dark"
        position="top-center"
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      {/* Search Section */}
      <div className="bg-white flex flex-col rounded-lg shadow-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full  mx-auto">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              State
            </label>
            <select
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value);
                setSelectedTown("");
              }}
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a state</option>
              {Object.keys(statesAndTowns).map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Town
            </label>
            <select
              value={selectedTown}
              onChange={(e) => setSelectedTown(e.target.value)}
              disabled={!selectedState}
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
        </div>

        <div className="mt-6 text-center">
          <Button
            onClick={handleSearch}
            disabled={!selectedState || !selectedTown || loading}
            className="w-full max-w-md flex items-center justify-center gap-2"
          >
            <Search size={20} />
            {loading ? "Searching..." : "Find Labs"}
          </Button>
        </div>
      </div>

      {/* Labs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {labs.map((lab) => (
          <div
            key={lab.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {lab.labName}
              </h3>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-gray-600">
                  <Building2 size={18} />
                  <p>{lab.address}</p>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <Phone size={18} />
                  <p>{lab.phone}</p>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <Clock size={18} />
                  <p>
                    {lab.operatingHours.openingTime} -
                    {lab.operatingHours.closingTime}
                  </p>
                </div>

                <div className="flex items-start gap-2 text-gray-600">
                  <Beaker size={18} className="mt-1" />
                  <div>
                    <p className="font-medium mb-1">{lab.email}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Button
                  onClick={() => {
                    setSelectedLab(lab);
                    setIsModalOpen(true);
                  }}
                  className="flex-1 flex items-center justify-center gap-2"
                >
                  <CalendarCheck size={18} />
                  Book Appointment
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 flex items-center justify-center gap-2"
                >
                  <MapPin size={18} />
                  Get Directions
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Appointment Modal */}
      {isModalOpen && selectedLab && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">
              Book Appointment at {selectedLab.labName}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <Input
                  type="text"
                  value={user?.firstName || ""}
                  disabled
                  className="bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <Input
                  type="text"
                  value={user?.lastName || ""}
                  disabled
                  className="bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time
                </label>
                <Input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Test
              </label>
              <select
                value={selectedService}
                onChange={(e) => {
                  const selectedServiceName = e.target.value;
                  setSelectedService(selectedServiceName);
                  // Add the selected test to the tests array
                  if (
                    selectedServiceName &&
                    !selectedTests.includes(selectedServiceName)
                  ) {
                    setSelectedTests([...selectedTests, selectedServiceName]);
                  }
                }}
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a test</option>
                {selectedLab.services.map((service) => (
                  <option key={service.id} value={service.name}>
                    {service.name} - ₦{service.labPrice.toFixed(2)}
                  </option>
                ))}
              </select>
            </div>

            {/* Add selected tests display */}
            <div className="mt-4">
              {selectedTests.map((test) => (
                <div
                  key={test}
                  className="flex items-center justify-between bg-gray-50 p-3 rounded mb-2"
                >
                  <span>{test}</span>
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedTests(selectedTests.filter((t) => t !== test))
                    }
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            {selectedService && (
              <div className="mt-4 bg-blue-50 p-4 rounded-lg">
                <h3 className="text-md font-semibold mb-2">Service Details</h3>
                {(() => {
                  const selectedServiceDetails = selectedLab.services.find(
                    (service) => service.name === selectedService
                  );
                  return selectedServiceDetails ? (
                    <div className="space-y-2">
                      <p>
                        <span className="font-medium">Sample Type:</span>{" "}
                        {selectedServiceDetails.details.sampleType}
                      </p>
                      <p>
                        <span className="font-medium">Collection Method:</span>{" "}
                        {selectedServiceDetails.details.collectionMethod}
                      </p>
                      <p>
                        <span className="font-medium">Results Timeframe:</span>{" "}
                        {selectedServiceDetails.details.resultsTimeframe}
                      </p>
                      <p>
                        <span className="font-medium">Preparation:</span>{" "}
                        {selectedServiceDetails.details.preparation}
                      </p>
                    </div>
                  ) : null;
                })()}
              </div>
            )}

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes
              </label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special requirements or concerns..."
                className="h-32"
              />
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleSubmitAppointment}
                disabled={bookingLoading}
                className="flex-1 flex items-center justify-center gap-2"
              >
                <CalendarCheck size={18} />
                {bookingLoading ? "Booking..." : "Confirm Booking"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* No Results Message */}
      {labs.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No labs found in this location.
          </p>
          <p className="text-gray-400">Try searching in a different area.</p>
        </div>
      )}
    </div>
  );
}
