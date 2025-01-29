"use client";
import { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";

interface Lab {
  id: string;
  labName: string;
  address: string;
  phone: string;
  services: string[];
}

const AvailableLabs = ({ selectedTests }: { selectedTests: string[] }) => {
  const [labs, setLabs] = useState<Lab[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedLab, setSelectedLab] = useState<Lab | null>(null);

  useEffect(() => {
    const fetchLabs = async () => {
      try {
        const labsQuery = query(
          collection(db, "users"),
          where("role", "==", "lab")
        );
        const querySnapshot = await getDocs(labsQuery);

        const filteredLabs: Lab[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const labServices = data.services || [];

          // Check if the lab provides all selected tests
          if (selectedTests.every((test) => labServices.includes(test))) {
            filteredLabs.push({
              id: doc.id,
              labName: data.labName,
              address: data.address,
              phone: data.phone,
              services: labServices,
            });
          }
        });

        setLabs(filteredLabs);
      } catch (error) {
        console.error("Error fetching labs:", error);
      } finally {
        setLoading(false);
      }
    };

    if (selectedTests.length > 0) {
      fetchLabs();
    }
  }, [selectedTests]);

  const handleMakeAppointment = (lab: Lab) => {
    setSelectedLab(lab); // Open the appointment modal
  };

  const closeModal = () => {
    setSelectedLab(null); // Close the modal
  };

  if (loading) return <p>Loading labs...</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Labs Offering Selected Tests</h1>
      {labs.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {labs.map((lab) => (
            <div
              key={lab.id}
              className="p-4 bg-white shadow-md rounded-lg border"
            >
              <h2 className="text-lg font-semibold">{lab.labName}</h2>
              <p className="text-sm text-gray-600">Address: {lab.address}</p>
              <p className="text-sm text-gray-600">Phone: {lab.phone}</p>
              <button
                onClick={() => handleMakeAppointment(lab)}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Make an Appointment
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>No labs found for the selected tests.</p>
      )}

      {/* Appointment Modal */}
    </div>
  );
};

export default AvailableLabs;
