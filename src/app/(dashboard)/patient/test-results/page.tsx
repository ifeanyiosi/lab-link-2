"use client";

import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Download,
  Eye,
  TestTube,
  Hospital,
  AlertCircle,
} from "lucide-react";

interface TestResult {
  id: string;
  userId: string;
  labId: string;
  labName: string;
  services: string[];
  resultPdfUrl: string;
  testDate: string;
}

export default function PatientResultsDashboard() {
  const { user } = useAuth();
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchPatientResults = async () => {
      if (!user?.uid) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }

      try {
        const resultsRef = collection(db, "results");
        // Query results where the document's userId equals the current user's uid
        const q = query(resultsRef, where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);

        const resultsData: TestResult[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as TestResult[];

        setResults(resultsData);
      } catch (err) {
        console.error("Error fetching results:", err);
        setError("Failed to fetch test results");
      } finally {
        setLoading(false);
      }
    };

    fetchPatientResults();
  }, [user?.uid]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDownloadPDF = (pdfUrl: string) => {
    const link = document.createElement("a");
    link.href = pdfUrl;
    // Generate a filename that includes today’s date
    link.download = `test_result_${new Date().toISOString().split("T")[0]}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 p-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex items-center gap-3">
          <AlertCircle className="text-red-600" />
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          My Test Results
        </h1>

        {results.length === 0 ? (
          <div className="text-center bg-white rounded-2xl shadow-lg p-12 space-y-4">
            <div className="text-7xl opacity-30">🩺</div>
            <h3 className="text-xl font-semibold text-gray-800">
              No Test Results
            </h3>
            <p className="text-gray-500">
              Your test results will appear here once they are available.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {results.map((result) => (
              <Card
                key={result.id}
                className="overflow-hidden border-2 border-transparent hover:border-blue-200 rounded-2xl transition-all duration-300 hover:shadow-xl"
              >
                <CardHeader className="bg-blue-50 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Hospital className="h-6 w-6 text-blue-600" />
                      <h2 className="text-lg font-bold text-gray-800">
                        {result.labName}
                      </h2>
                    </div>
                    <span className="text-sm text-gray-500">
                      {formatDate(result.testDate)}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-start gap-3 bg-gray-100 p-3 rounded-xl">
                    <TestTube className="h-5 w-5 text-blue-600 mt-1" />
                    <div>
                      <span className="font-semibold text-gray-800">
                        Services:
                      </span>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {result.services.map((service, index) => (
                          <span
                            key={index}
                            className="bg-white text-gray-700 px-3 py-1 rounded-full text-xs border"
                          >
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <span className="text-gray-700 font-medium">
                        Test Report
                      </span>
                    </div>
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-blue-500 text-blue-600 hover:bg-blue-50"
                        onClick={() =>
                          window.open(result.resultPdfUrl, "_blank")
                        }
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-green-500 text-green-600 hover:bg-green-50"
                        onClick={() => handleDownloadPDF(result.resultPdfUrl)}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
