// src/app/(admin)/tests/manage/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

import { addDoc, collection } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { db } from "@/firebase/firebaseConfig";

interface TestFormData {
  name: string;
  description: string;

  details: {
    sampleType: string;
    collectionMethod: string;
    resultsTime: string;
    preparation: string;
  };
}

export default function TestManagement() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TestFormData>();

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/");
    }
  }, [user, router]);

  const onSubmit = async (data: TestFormData) => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      await addDoc(collection(db, "tests"), {
        ...data,
        createdAt: new Date().toISOString(),
        createdBy: user?.uid,
      });

      setSuccess("Test added successfully!");
      reset();
    } catch (err) {
      setError("Failed to add test. Please try again.");
      console.error("Error adding test:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Add New Lab Test
        </h1>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-4">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            {/* Test Information */}
            <div className="border-b border-gray-200 pb-4">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">
                General Information
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Test Name *
                  </label>
                  <input
                    {...register("name", { required: "Test name is required" })}
                    className={`w-full p-2 border rounded-md ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    {...register("description", {
                      required: "Description is required",
                    })}
                    className={`w-full p-2 border rounded-md ${
                      errors.description ? "border-red-500" : "border-gray-300"
                    }`}
                    rows={3}
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.description.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Test Details */}
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-4">
                Test Details
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sample Type *
                  </label>
                  <input
                    {...register("details.sampleType", {
                      required: "Sample type is required",
                    })}
                    className={`w-full p-2 border rounded-md ${
                      errors.details?.sampleType
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.details?.sampleType && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.details.sampleType.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Collection Method *
                  </label>
                  <input
                    {...register("details.collectionMethod", {
                      required: "Collection method is required",
                    })}
                    className={`w-full p-2 border rounded-md ${
                      errors.details?.collectionMethod
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.details?.collectionMethod && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.details.collectionMethod.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Results Time *
                  </label>
                  <input
                    {...register("details.resultsTime", {
                      required: "Results time is required",
                    })}
                    className={`w-full p-2 border rounded-md ${
                      errors.details?.resultsTime
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="e.g., 24-48 hours"
                  />
                  {errors.details?.resultsTime && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.details.resultsTime.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preparation Instructions *
                  </label>
                  <textarea
                    {...register("details.preparation", {
                      required: "Preparation instructions are required",
                    })}
                    className={`w-full p-2 border rounded-md ${
                      errors.details?.preparation
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    rows={3}
                  />
                  {errors.details?.preparation && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.details.preparation.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300"
          >
            {loading ? "Adding Test..." : "Add Test"}
          </button>
        </form>
      </div>
    </div>
  );
}
