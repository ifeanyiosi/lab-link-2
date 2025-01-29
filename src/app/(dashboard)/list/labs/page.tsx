"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, where, addDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface Lab {
  id: string;
  labName: string;
  email: string;
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

const AvailableLabs = () => {
  const [labs, setLabs] = useState<Lab[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const labsPerPage = 5;

  const router = useRouter();

  useEffect(() => {
    const fetchLabs = async () => {
      try {
        const labsQuery = query(
          collection(db, "users"),
          where("role", "==", "lab")
        );
        const querySnapshot = await getDocs(labsQuery);
        const labsList: Lab[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          labsList.push({
            id: doc.id,
            labName: data.labName,
            email: data.email,
            address: data.address,
            phone: data.phone,
            operatingHours: {
              openingTime: data.operatingHours?.openingTime || "N/A",
              closingTime: data.operatingHours?.closingTime || "N/A",
            },
            services: data.services || [],
            state: data.state,
            town: data.town,
          });
        });
        setLabs(labsList);
      } catch (error) {
        console.error("Error fetching labs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLabs();
  }, []);

  const totalPages = Math.ceil(labs.length / labsPerPage);
  const paginatedLabs = labs.slice(
    (currentPage - 1) * labsPerPage,
    currentPage * labsPerPage
  );

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handleMakeAppointment = async (labId: string, labName: string) => {
    try {
      // Simulate user ID for the appointment
      const userId = "currentUser123"; // Replace with the actual logged-in user ID

      const appointment = {
        labId,
        labName,
        userId,
        appointmentDate: new Date().toISOString(), // Set to current date; adjust as needed
        status: "Scheduled",
        notes: "",
      };

      await addDoc(collection(db, "appointments"), appointment);
      alert(`Appointment created with ${labName}`);
    } catch (error) {
      console.error("Error creating appointment:", error);
      alert("Failed to create an appointment. Please try again.");
    }
  };

  const handleGetDirections = (address: string) => {
    const encodedAddress = encodeURIComponent(address);
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
    window.open(googleMapsUrl, "_blank");
  };

  if (loading) return <p>Loading labs...</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Available Labs</h1>
      {paginatedLabs.length > 0 ? (
        <ul className="space-y-4">
          {paginatedLabs.map((lab) => (
            <li
              key={lab.id}
              className="p-4 border rounded-lg shadow-md bg-white space-y-2"
            >
              <h3 className="text-xl font-semibold">{lab.labName}</h3>
              <p className="text-sm text-gray-600">
                <strong>Email:</strong> {lab.email}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Phone:</strong> {lab.phone}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Address:</strong> {lab.address}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Operating Hours:</strong>{" "}
                {lab.operatingHours.openingTime} -{" "}
                {lab.operatingHours.closingTime}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Services:</strong>{" "}
                {lab.services.length > 0
                  ? lab.services.join(", ")
                  : "No services listed"}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Location:</strong> {lab.town}, {lab.state}
              </p>
              <div className="flex space-x-4 mt-4">
                <Button
                  variant="default"
                  onClick={() => handleMakeAppointment(lab.id, lab.labName)}
                >
                  Make Appointment
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleGetDirections(lab.address)}
                >
                  Get Directions
                </Button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No labs available at the moment.</p>
      )}
      <div className="flex justify-between items-center mt-6">
        <Button
          variant="outline"
          disabled={currentPage === 1}
          onClick={handlePreviousPage}
        >
          Previous
        </Button>
        <span className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline"
          disabled={currentPage === totalPages}
          onClick={handleNextPage}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default AvailableLabs;
