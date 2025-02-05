"use client";

import React, { useState, useEffect } from "react";
import { Plus, X, DollarSign, Search } from "lucide-react";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  onSnapshot,
  doc,
} from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";
import { db } from "@/firebase/firebaseConfig";

interface TestDetail {
  sampleType: string;
  collectionMethod: string;
  resultsTimeframe: string;
  preparation: string;
}

interface Test {
  id: string;
  name: string;
  description: string;
  details: TestDetail;
}

export interface LabService extends Test {
  labId: string;
  labPrice: number;
}

const LabServicesPage: React.FC = () => {
  const { user } = useAuth();
  const [availableTests, setAvailableTests] = useState<Test[]>([]);
  const [labServices, setLabServices] = useState<LabService[]>([]);
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [price, setPrice] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // Fetch available tests from Firestore
  useEffect(() => {
    const fetchTests = async () => {
      try {
        const q = query(collection(db, "tests"));
        const querySnapshot = await getDocs(q);
        const tests = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Test[];
        setAvailableTests(tests);
      } catch (error) {
        toast.error("Failed to load tests");
      }
    };

    fetchTests();
  }, []);

  // Subscribe to lab's services
  useEffect(() => {
    if (!user?.uid) return;

    const labDocRef = doc(db, "labs", user.uid);
    const servicesColRef = collection(labDocRef, "lab-services");

    const unsubscribe = onSnapshot(servicesColRef, (snapshot) => {
      const services = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as LabService[];
      setLabServices(services);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  const handleAddService = async () => {
    if (!user?.uid || !selectedTest || !price) return;

    const priceNumber = parseFloat(price);
    if (isNaN(priceNumber) || priceNumber <= 0) {
      toast.error("Please enter a valid price");
      return;
    }

    setLoading(true);
    try {
      const labDocRef = doc(db, "labs", user.uid);
      const servicesColRef = collection(labDocRef, "lab-services");

      await addDoc(servicesColRef, {
        ...selectedTest,
        labId: user.uid,
        labPrice: priceNumber,
      });

      setSelectedTest(null);
      setPrice("");
      toast.success("Service added successfully!");
    } catch (error) {
      console.error("Error adding service:", error);
      toast.error("Failed to add service");
    } finally {
      setLoading(false);
    }
  };

  const filteredTests = availableTests.filter((test) =>
    test.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto py-6">
      {/* Pricing Modal */}
      {selectedTest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Set Service Price</h3>
              <button
                onClick={() => setSelectedTest(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-4">
              <p className="font-medium">{selectedTest.name}</p>
            </div>

            <div className="relative flex mb-4">
              <DollarSign
                className="absolute left-3 top-2.5 text-gray-400"
                size={20}
              />
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Enter price in Naira ₦"
                className="pl-10 w-full border rounded-md p-2"
                min="0"
                step="0.01"
              />
            </div>

            <button
              onClick={handleAddService}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? "Adding Service..." : "Add Service"}
            </button>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-2 lg:gap-8 ">
        {/* Available Tests Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Available Tests</h2>
          <div className="relative mb-4">
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search tests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full border rounded-md p-2"
            />
          </div>
          <div className="space-y-4">
            {filteredTests.map((test) => (
              <div
                key={test.id}
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold">{test.name}</h3>
                  </div>
                  <button
                    onClick={() => setSelectedTest(test)}
                    className="flex items-center text-blue-600 hover:bg-blue-50 p-2 rounded-lg"
                  >
                    <Plus size={20} />
                  </button>
                </div>
                <div className="text-sm text-gray-500 mt-2 space-y-1">
                  <p>
                    <strong>Sample:</strong> {test.details.sampleType}
                  </p>
                  <p>
                    <strong>Method:</strong> {test.details.collectionMethod}
                  </p>
                  <p>
                    <strong>Results:</strong> {test.details.resultsTimeframe}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lab Services Section */}
        <div className="bg-white rounded-lg shadow-md px-4 py-6">
          <h2 className="text-2xl font-bold mb-4">Your Lab Services</h2>
          <div className="space-y-4">
            {labServices.map((service) => (
              <div
                key={service.id}
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{service.name}</h3>
                  </div>
                  <div className="text-lg font-semibold text-green-600">
                    ₦{service.labPrice.toFixed(2)}
                  </div>
                </div>
                <div className="text-sm text-gray-500 mt-2 space-y-1">
                  <p>
                    <strong>Sample:</strong> {service.details.sampleType}
                  </p>
                  <p>
                    <strong>Results:</strong> {service.details.resultsTimeframe}
                  </p>
                </div>
              </div>
            ))}
            {labServices.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                No services added yet. Select tests from the left to add them.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabServicesPage;
