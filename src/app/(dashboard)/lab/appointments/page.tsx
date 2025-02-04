"use client";

import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/firebase/firebaseConfig";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  Clock,
  FileText,
  User,
  Building2,
  Bookmark,
  AlertCircle,
  Upload,
  ClockIcon,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";

interface Lab {
  id: string;
  email: string;
  labName: string;
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

interface Appointment {
  id?: string;
  userId: string;
  labId: string;
  date: string;
  time: string;
  tests: string[];
  status: "pending" | "confirmed" | "completed" | "canceled";
  notes?: string;
  labName: string;
  patientFirstName: string;
  patientLastName: string;
  resultPdfUrl?: string;
}

const statusConfig = {
  pending: {
    color: "text-amber-600 bg-amber-50 border-amber-200",
    icon: <ClockIcon className="h-5 w-5 text-amber-600" />,
  },
  confirmed: {
    color: "text-green-600 bg-green-50 border-green-200",
    icon: <CheckCircle2 className="h-5 w-5 text-green-600" />,
  },
  completed: {
    color: "text-blue-600 bg-blue-50 border-blue-200",
    icon: <CheckCircle2 className="h-5 w-5 text-blue-600" />,
  },
  canceled: {
    color: "text-red-600 bg-red-50 border-red-200",
    icon: <XCircle className="h-5 w-5 text-red-600" />,
  },
};

export default function AppointmentsDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<
    Appointment[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fileUploadError, setFileUploadError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<Appointment["status"]>("pending");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6); // Items per page

  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAppointments = filteredAppointments.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const [uploadingAppointments, setUploadingAppointments] = useState<{
    [key: string]: boolean;
  }>({});

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const PaginationControls = () => (
    <div className="flex justify-center items-center gap-4 mt-8">
      <Button
        variant="outline"
        onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
        disabled={currentPage === 1}
      >
        Previous
      </Button>
      <span className="text-sm text-gray-600">
        Page {currentPage} of {totalPages}
      </span>
      <Button
        variant="outline"
        onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
        disabled={currentPage === totalPages}
      >
        Next
      </Button>
    </div>
  );

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user?.uid) return;

      setLoading(true);
      setError("");

      try {
        const appointmentsRef = collection(db, "appointments");
        const q =
          user?.role === "lab"
            ? query(appointmentsRef, where("labId", "==", user.uid))
            : query(appointmentsRef, where("userId", "==", user.uid));

        const querySnapshot = await getDocs(q);
        const appointmentsData = querySnapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            } as Appointment)
        );

        setAppointments(appointmentsData);
        filterAppointmentsByStatus(appointmentsData, activeTab);
      } catch (err) {
        setError("Failed to fetch appointments. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [user?.uid, user?.role]);

  useEffect(() => {
    filterAppointmentsByStatus(appointments, activeTab);
  }, [activeTab, appointments]);

  const filterAppointmentsByStatus = (
    appointments: Appointment[],
    status: string
  ) => {
    const filtered = appointments.filter((app) => app.status === status);
    setFilteredAppointments(filtered);
  };

  const handleStatusUpdate = async (
    appointmentId: string,
    newStatus: Appointment["status"]
  ) => {
    try {
      const appointment = appointments.find((app) => app.id === appointmentId);
      if (!appointmentId || appointment?.status === "completed") {
        throw new Error("Cannot update completed appointments");
      }

      const appointmentRef = doc(db, "appointments", appointmentId);
      await updateDoc(appointmentRef, { status: newStatus });

      setAppointments((prev) =>
        prev.map((app) =>
          app.id === appointmentId ? { ...app, status: newStatus } : app
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
      setError("Failed to update appointment status");
    }
  };

  const handlePdfUpload = async (
    appointmentId: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileUploadError("");
    setUploadingAppointments((prev) => ({ ...prev, [appointmentId]: true }));

    try {
      if (!appointmentId || !user?.uid)
        throw new Error("Missing required identifiers");

      // Find the appointment data
      const appointment = appointments.find((app) => app.id === appointmentId);
      if (!appointment) throw new Error("Appointment not found");

      // Upload PDF to storage
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
      const storagePath = `results/${user.uid}/${appointmentId}/${sanitizedFileName}`;
      const storageRef = ref(storage, storagePath);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      // Update appointment with PDF URL
      const appointmentRef = doc(db, "appointments", appointmentId);
      await updateDoc(appointmentRef, { resultPdfUrl: downloadURL });

      // Add to user's results collection
      const userId = appointment.userId;
      const resultDocRef = doc(db, "users", userId, "results", appointmentId);

      await setDoc(
        resultDocRef,
        {
          labName: appointment.labName,
          tests: appointment.tests,
          date: appointment.date,
          resultPdfUrl: downloadURL,
          uploadedAt: new Date(),
          appointmentId: appointmentId,
        },
        { merge: true }
      );

      // Update local state
      setAppointments((prev) =>
        prev.map((app) =>
          app.id === appointmentId ? { ...app, resultPdfUrl: downloadURL } : app
        )
      );
    } catch (error) {
      console.error("PDF Upload Error:", error);
      setFileUploadError(
        error instanceof Error ? error.message : "Failed to upload PDF"
      );
    } finally {
      setUploadingAppointments((prev) => ({ ...prev, [appointmentId]: false }));
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col  md:items-center md:justify-between gap-6">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Appointment Dashboard
          </h1>

          <div className="flex flex-wrap w-full gap-2 bg-white shadow-md rounded-xl p-2">
            {(["pending", "confirmed", "completed", "canceled"] as const).map(
              (status) => (
                <button
                  key={status}
                  onClick={() => setActiveTab(status)}
                  className={`
                  px-4 py-2 rounded-lg transition-all duration-300 
                  flex items-center gap-2 text-sm font-semibold
                  ${
                    activeTab === status
                      ? `${statusConfig[status].color} ring-2 ring-offset-2`
                      : "text-gray-500 hover:bg-gray-100"
                  }
                `}
                >
                  {statusConfig[status].icon}
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                  <span className="text-xs bg-gray-100 px-2 rounded-full">
                    {appointments.filter((app) => app.status === status).length}
                  </span>
                </button>
              )
            )}
          </div>
        </div>

        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex items-center gap-3">
            <AlertCircle className="text-red-600" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {!loading && filteredAppointments.length === 0 && (
          <div className="text-center bg-white rounded-2xl shadow-lg p-12 space-y-4">
            <div className="text-7xl opacity-30">📅</div>
            <h3 className="text-xl font-semibold text-gray-800">
              No {activeTab} appointments
            </h3>
            <p className="text-gray-500">
              Your upcoming appointments will appear here
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentAppointments.map((appointment) => (
            <div
              key={appointment.id}
              className="group transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              <Card className="overflow-hidden border-2 border-transparent hover:border-blue-200 rounded-2xl">
                <CardContent className="p-6 space-y-4">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      {user?.role === "lab" ? (
                        <User className="h-6 w-6 text-blue-600" />
                      ) : (
                        <Building2 className="h-6 w-6 text-blue-600" />
                      )}
                      <h3 className="text-lg font-bold text-gray-800">
                        {user?.role === "lab"
                          ? `${appointment.patientFirstName} ${appointment.patientLastName}`
                          : appointment.labName}
                      </h3>
                    </div>

                    {user?.role === "lab" ? (
                      <select
                        value={appointment.status}
                        onChange={(e) =>
                          handleStatusUpdate(
                            appointment.id!,
                            e.target.value as Appointment["status"]
                          )
                        }
                        disabled={appointment.status === "completed"}
                        className={`
    px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider
    ${statusConfig[appointment.status].color}
    ${
      appointment.status === "completed"
        ? "cursor-not-allowed opacity-75"
        : "cursor-pointer bg-white shadow-sm hover:shadow-md"
    }
  `}
                      >
                        {(
                          [
                            "pending",
                            "confirmed",
                            "completed",
                            "canceled",
                          ] as const
                        ).map((status) => (
                          <option
                            key={status}
                            value={status}
                            // Only disable completed option if appointment isn't already completed
                            disabled={
                              status === "completed" &&
                              appointment.status === "completed"
                            }
                            className={statusConfig[status].color}
                          >
                            {status}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                          statusConfig[appointment.status].color
                        }`}
                      >
                        {appointment.status}
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 bg-gray-100 p-3 rounded-xl">
                      <CalendarDays className="h-5 w-5 text-blue-600" />
                      <span className="font-medium text-gray-700">
                        {formatDate(appointment.date)}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 bg-gray-100 p-3 rounded-xl">
                      <Clock className="h-5 w-5 text-blue-600" />
                      <span className="font-medium text-gray-700">
                        {appointment.time}
                      </span>
                    </div>

                    <div className="bg-gray-100 p-3 rounded-xl">
                      <div className="flex items-start gap-3">
                        <FileText className="h-5 w-5 text-blue-600 mt-1" />
                        <div>
                          <span className="font-semibold text-gray-800">
                            Tests:
                          </span>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {appointment.tests.map((test, index) => (
                              <span
                                key={index}
                                className="bg-white text-gray-700 px-3 py-1 rounded-full text-xs border"
                              >
                                {test}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {appointment.notes && (
                      <div className="bg-gray-100 p-3 rounded-xl flex items-start gap-3 italic text-gray-600">
                        <Bookmark className="h-5 w-5 text-blue-600 mt-1" />
                        {appointment.notes}
                      </div>
                    )}

                    {user?.role === "lab" && activeTab === "completed" && (
                      <div className="pt-4 border-t">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-semibold text-gray-800">
                              Test Results
                            </p>
                            {appointment.resultPdfUrl ? (
                              <a
                                href={appointment.resultPdfUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline text-sm flex items-center gap-2"
                              >
                                <FileText className="h-4 w-4" />
                                View PDF
                              </a>
                            ) : (
                              <p className="text-gray-500 text-sm">
                                No results uploaded
                              </p>
                            )}
                          </div>

                          <div className="relative">
                            <input
                              type="file"
                              accept=".pdf"
                              id={`pdf-upload-${appointment.id}`}
                              onChange={(e) =>
                                handlePdfUpload(appointment.id!, e)
                              }
                              disabled={isUploading}
                            />
                            <label
                              htmlFor={`pdf-upload-${appointment.id}`}
                              className={`cursor-pointer ${
                                isUploading
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                            >
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-blue-500 text-blue-600 hover:bg-blue-50 relative"
                                disabled={
                                  appointment?.id
                                    ? uploadingAppointments[appointment.id]
                                    : false
                                }
                              >
                                {appointment?.id &&
                                uploadingAppointments[appointment.id] ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Uploading...
                                  </>
                                ) : (
                                  <>
                                    <Upload className="mr-2 h-4 w-4" />
                                    Upload
                                  </>
                                )}
                              </Button>
                            </label>
                          </div>
                        </div>

                        {fileUploadError && (
                          <p className="text-red-500 text-xs mt-2">
                            {fileUploadError}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {filteredAppointments.length > itemsPerPage && <PaginationControls />}
      </div>
    </div>
  );
}
