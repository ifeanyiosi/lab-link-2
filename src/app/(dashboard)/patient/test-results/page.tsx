"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { useAuth } from "@/context/AuthContext";
import { FileText, Download } from "lucide-react";

interface Result {
  labName: string;
  tests: string[];
  date: string;
  resultPdfUrl: string;
  uploadedAt: Date;
}

export default function ResultsHistory() {
  const { user } = useAuth();
  const [results, setResults] = useState<Result[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        if (!user?.uid) return;

        const resultsRef = collection(db, "users", user.uid, "results");
        const snapshot = await getDocs(resultsRef);
        const fetchedResults = snapshot.docs.map((doc) => doc.data() as Result);

        // Sort results by most recent first
        fetchedResults.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        setResults(fetchedResults);
      } catch (error) {
        console.error("Error fetching results:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [user?.uid]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center text-gray-500 p-8">
        <FileText className="mx-auto mb-4 h-16 w-16 text-gray-300" />
        <p>No medical results found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {results.map((result, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 transform"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                {result.labName}
              </h3>
              <FileText className="h-6 w-6 text-blue-500" />
            </div>

            <p className="text-sm text-gray-500 mb-4">
              {new Date(result.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              {result.tests.map((test, i) => (
                <span
                  key={i}
                  className="bg-blue-50 text-blue-600 px-2 py-1 rounded-full text-xs"
                >
                  {test}
                </span>
              ))}
            </div>

            <a
              href={result.resultPdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Results
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
