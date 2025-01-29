"use client";
import AvailableLabs from "@/components/AvaliableLabs";
import { useState } from "react";


const AvailableTests = () => {
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [showLabs, setShowLabs] = useState(false);

  // Predefined list of tests. This could be fetched from Firestore if necessary.
  const allTests = [
    "Blood Test",
    "X-Ray",
    "MRI",
    "Ultrasound",
    "CT Scan",
    "Covid Test",
  ];

  // Handle test selection
  const handleTestChange = (test: string) => {
    setSelectedTests((prev) =>
      prev.includes(test) ? prev.filter((t) => t !== test) : [...prev, test]
    );
  };

  // Submit the selected tests and show labs offering them
  const handleSearchLabs = () => {
    setShowLabs(true);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Select Tests</h1>
      <div className="space-y-2">
        {allTests.map((test) => (
          <div key={test} className="flex items-center">
            <input
              type="checkbox"
              id={test}
              checked={selectedTests.includes(test)}
              onChange={() => handleTestChange(test)}
              className="mr-2"
            />
            <label htmlFor={test}>{test}</label>
          </div>
        ))}
      </div>
      <button
        onClick={handleSearchLabs}
        disabled={selectedTests.length === 0}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Search Labs Offering Selected Tests
      </button>

      {/* Show Labs Component */}
      {showLabs && <AvailableLabs selectedTests={selectedTests} />}
    </div>
  );
};

export default AvailableTests;
