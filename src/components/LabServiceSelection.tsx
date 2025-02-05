"use client";

import React, { useState, useEffect } from "react";
import { collection, query, getDocs, doc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { Search } from "lucide-react";

interface TestDetail {
  sampleType: string;
  collectionMethod: string;
  resultsTimeframe: string;
  preparation: string;
}

interface LabService {
  id: string;
  name: string;
  description: string;
  details: TestDetail;
  labId: string;
  labPrice: number;
}

interface Props {
  labId: string;
  onServiceSelect: (service: LabService) => void;
  selectedServices: LabService[];
}

const LabServiceSelection: React.FC<Props> = ({
  labId,
  onServiceSelect,
  selectedServices,
}) => {
  const [services, setServices] = useState<LabService[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLabServices = async () => {
      try {
        const labDocRef = doc(db, "labs", labId);
        const servicesRef = collection(labDocRef, "lab-services");
        const querySnapshot = await getDocs(servicesRef);

        const labServices = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as LabService[];

        setServices(labServices);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };

    if (labId) {
      fetchLabServices();
    }
  }, [labId]);

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isServiceSelected = (serviceId: string) =>
    selectedServices.some((service) => service.id === serviceId);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">Select Laboratory Tests</h2>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search tests..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 w-full border rounded-md p-2"
        />
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-500">
          Loading services...
        </div>
      ) : (
        <div className="space-y-4">
          {filteredServices.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No services found
            </div>
          ) : (
            filteredServices.map((service) => (
              <div
                key={service.id}
                className={`border rounded-lg p-4 cursor-pointer transition-colors
                  ${
                    isServiceSelected(service.id)
                      ? "bg-blue-50 border-blue-200"
                      : "hover:bg-gray-50"
                  }`}
                onClick={() => onServiceSelect(service)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{service.name}</h3>
                    <div className="text-sm text-gray-500 mt-2 space-y-1">
                      <p>
                        <strong>Sample:</strong> {service.details.sampleType}
                      </p>
                      <p>
                        <strong>Results:</strong>{" "}
                        {service.details.resultsTimeframe}
                      </p>
                      <p>
                        <strong>Preparation:</strong>{" "}
                        {service.details.preparation}
                      </p>
                    </div>
                  </div>
                  <div className="text-lg font-semibold text-green-600">
                    ₦{service.labPrice.toFixed(2)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default LabServiceSelection;
