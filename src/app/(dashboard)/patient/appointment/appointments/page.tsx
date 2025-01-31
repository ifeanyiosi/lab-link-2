"use client";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { useAuth } from "@/context/AuthContext";
import {
  CalendarDays,
  Clock,
  FlaskConical,
  FileText,
  Building2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export interface Appointment {
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
}

export default function PatientDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<
    Appointment[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<
    "pending" | "confirmed" | "completed" | "canceled"
  >("pending");

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user?.uid) return;

      setLoading(true);
      setError("");

      try {
        const appointmentsRef = collection(db, "appointments");
        const q = query(appointmentsRef, where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);

        const appointmentsData: Appointment[] = [];
        querySnapshot.forEach((doc) => {
          appointmentsData.push({ id: doc.id, ...doc.data() } as Appointment);
        });

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
  }, [user?.uid]);

  useEffect(() => {
    filterAppointmentsByStatus(appointments, activeTab);
  }, [activeTab, appointments]);

  const filterAppointmentsByStatus = (
    appointments: Appointment[],
    status: string
  ) => {
    const filtered = appointments.filter(
      (appointment) => appointment.status === status
    );
    setFilteredAppointments(filtered);
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200";
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "canceled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="max-w-7xl mx-auto py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
          <p className="text-gray-600 mt-2">
            Track and manage your lab appointments
          </p>
        </div>

        <div className="mt-4 md:mt-0">
          <Button variant="outline" className="flex items-center gap-2">
            <CalendarDays size={18} />
            New Appointment
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <Tabs
        value={activeTab}
        onValueChange={(value: any) => setActiveTab(value)}
        className="md:space-y-6 space-y-[50px] "
      >
        <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-yellow-400" />
            Pending
          </TabsTrigger>
          <TabsTrigger value="confirmed" className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            Confirmed
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-400" />
            Completed
          </TabsTrigger>
          <TabsTrigger value="canceled" className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-400" />
            Canceled
          </TabsTrigger>
        </TabsList>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <TabsContent value={activeTab} className="mt-6 ">
            {filteredAppointments.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <div className="text-gray-400 mb-4">
                  <CalendarDays size={48} className="mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">
                  No {activeTab} appointments
                </h3>
                <p className="text-gray-600 mt-2">
                  When you schedule appointments, they&apos;ll appear here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAppointments.map((appointment) => (
                  <Card
                    key={appointment.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <CardContent className="p-6 ">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Building2 size={20} className="text-gray-400" />
                          <h3 className="font-semibold text-lg text-gray-900">
                            {appointment.labName}
                          </h3>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusStyles(
                            appointment.status
                          )}`}
                        >
                          {appointment.status.charAt(0).toUpperCase() +
                            appointment.status.slice(1)}
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center gap-3 text-gray-600">
                          <CalendarDays size={18} />
                          <span>{formatDate(appointment.date)}</span>
                        </div>

                        <div className="flex items-center gap-3 text-gray-600">
                          <Clock size={18} />
                          <span>{appointment.time}</span>
                        </div>

                        <div className="flex items-start gap-3 text-gray-600">
                          <FlaskConical size={18} className="mt-1" />
                          <div>
                            <p className="font-medium mb-2">Tests:</p>
                            <div className="flex flex-wrap gap-2">
                              {appointment.tests.map((test) => (
                                <span
                                  key={test}
                                  className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-sm"
                                >
                                  {test}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {appointment.notes && (
                          <div className="flex items-start gap-3 text-gray-600">
                            <FileText size={18} className="mt-1" />
                            <div>
                              <p className="font-medium mb-1">Notes:</p>
                              <p className="text-sm">{appointment.notes}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="mt-6 flex gap-3">
                        <Button variant="outline" className="flex-1">
                          View Details
                        </Button>
                        {appointment.status === "pending" && (
                          <Button
                            variant="outline"
                            className="flex-1 text-red-600 hover:text-red-700"
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
