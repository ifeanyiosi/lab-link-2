"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, where, addDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Clock,
  CheckCircle,
} from "lucide-react";

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

  const handleGoBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 ">
      <div className="flex items-center mb-6">
        <Button variant="ghost" className="mr-2 p-2" onClick={handleGoBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-3xl font-bold text-gray-800">Available Labs</h1>
      </div>

      {paginatedLabs.length > 0 ? (
        <div className="space-y-6">
          {paginatedLabs.map((lab) => (
            <div
              key={lab.id}
              className="p-6 border rounded-xl shadow-md bg-white hover:shadow-lg transition-shadow duration-300"
            >
              <h3 className="text-2xl font-semibold text-blue-600 mb-3">
                {lab.labName}
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center text-gray-700">
                    <Mail className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{lab.email}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Phone className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{lab.phone}</span>
                  </div>
                  <div className="flex items-start text-gray-700">
                    <MapPin className="h-4 w-4 mr-2 mt-1 text-gray-500" />
                    <span>
                      {lab.address}
                      <br />
                      {lab.town}, {lab.state}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-gray-700">
                    <Clock className="h-4 w-4 mr-2 text-gray-500" />
                    <span>
                      {lab.operatingHours.openingTime} -{" "}
                      {lab.operatingHours.closingTime}
                    </span>
                  </div>
                  <div className="flex items-start text-gray-700">
                    <CheckCircle className="h-4 w-4 mr-2 mt-1 text-gray-500" />
                    <div>
                      <div className="font-medium">Services:</div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {lab.services.length > 0 ? (
                          lab.services.map((service, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                            >
                              {service}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-500">
                            No services listed
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 mt-4">
                <Button
                  variant="default"
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => handleMakeAppointment(lab.id, lab.labName)}
                >
                  Make Appointment
                </Button>
                <Button
                  variant="outline"
                  className="text-blue-600 border-blue-600 hover:bg-blue-50"
                  onClick={() => handleGetDirections(lab.address)}
                >
                  Get Directions
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 p-8 rounded-lg text-center">
          <p className="text-gray-600">No labs available at the moment.</p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-8 bg-white p-4 rounded-lg shadow">
          <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={handlePreviousPage}
            className="border-gray-300"
          >
            Previous
          </Button>
          <div className="flex items-center gap-2">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentPage === index + 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
          <Button
            variant="outline"
            disabled={currentPage === totalPages}
            onClick={handleNextPage}
            className="border-gray-300"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default AvailableLabs;
