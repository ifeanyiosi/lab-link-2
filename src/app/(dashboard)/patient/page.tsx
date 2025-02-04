"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
} from "firebase/firestore";

import {
  Calendar,
  Clock,
  FileText,
  Building2,
  Activity,
  Plus,
  ChevronRight,
  Bell,
  Loader2,
} from "lucide-react";
import { db } from "@/firebase/firebaseConfig";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Appointment {
  date: string;
  time: string;
  labName: string;
  tests: string[];
  status: string;
}

interface Result {
  labName: string;
  tests: string[];
  date: string;
  resultPdfUrl: string;
  uploadedAt: Date;
}

const PatientDashboard: React.FC = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [upcomingAppointment, setUpcomingAppointment] =
    useState<Appointment | null>(null);
  const [results, setResults] = useState<Result[]>([]);

  const quickActions = [
    {
      icon: Calendar,
      title: "Schedule Test",
      description: "Book a new lab appointment",
      href: "/patient/appointment/create-appointment",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: FileText,
      title: "View Results",
      description: "Check your test results",
      href: "/patient/test-results",
      color: "bg-green-100 text-green-600",
    },
    {
      icon: Building2,
      title: "Find Lab",
      description: "Locate nearest lab",
      href: "/list/labs",
      color: "bg-purple-100 text-purple-600",
    },
    {
      icon: Activity,
      title: "Health Records",
      description: "View medical history",
      href: "/patient/records",
      color: "bg-orange-100 text-orange-600",
    },
  ];

  useEffect(() => {
    const fetchAppointmentsAndResults = async () => {
      if (!user) return;

      // Fetch upcoming appointments
      const appointmentsRef = collection(db, "appointments");
      const appointmentsQuery = query(
        appointmentsRef,
        where("userId", "==", user.uid),
        where("status", "==", "pending")
      );

      const appointmentsSnapshot = await getDocs(appointmentsQuery);
      const appointments = appointmentsSnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
            date: doc.data().date,
            time: doc.data().time,
            labName: doc.data().labName,
            tests: doc.data().tests,
            status: doc.data().status,
          } as Appointment)
      );

      // Sort and take the earliest appointment
      const sortedAppointments = appointments.sort(
        (a, b) =>
          new Date(`${a.date} ${a.time}`).getTime() -
          new Date(`${b.date} ${b.time}`).getTime()
      );
      setUpcomingAppointment(sortedAppointments[0] || null);

      // Fetch recent test results
      const resultsRef = collection(db, "users", user.uid, "results");
      const snapshot = await getDocs(resultsRef);
      const fetchedResults = snapshot.docs.map((doc) => doc.data() as Result);

      // Sort results by most recent first
      fetchedResults.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setResults(fetchedResults);
    };

    fetchAppointmentsAndResults();
  }, [user]);

  if (!user) {
    router.push("/sign-in");
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              Welcome back, {user.firstName}
            </h1>
            <p className="text-gray-600 mt-1">
              Here&apos;s what&apos;s happening with your health monitoring
            </p>
          </div>
          <Button asChild>
            <Link href={"/patient/appointment/create-appointment"}>
              Make an appointment
            </Link>
          </Button>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {quickActions.map((action) => (
            <button
              key={action.title}
              onClick={() => router.push(action.href)}
              className="p-4 rounded-xl bg-white border hover:border-blue-500 transition-all duration-200 text-left group"
            >
              <div className={`${action.color} p-2 rounded-lg w-fit`}>
                <action.icon size={20} />
              </div>
              <h3 className="font-semibold mt-3 text-gray-800 group-hover:text-blue-500">
                {action.title}
              </h3>
              <p className="text-sm text-gray-600 mt-1">{action.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Appointments & Results Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Next Appointment */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Next Appointment
            </h2>
            <button
              onClick={() => router.push("/patient/appointment/appointments")}
              className="text-blue-500 hover:text-blue-600 text-sm flex items-center gap-1"
            >
              View All
              <ChevronRight size={16} />
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-6">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : upcomingAppointment ? (
            <div className="border rounded-lg p-4">
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Calendar size={24} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800">
                    {upcomingAppointment.tests?.join(", ")}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {upcomingAppointment.labName}
                  </p>
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Calendar size={14} />
                      <span>{upcomingAppointment.date}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Clock size={14} />
                      <span>{upcomingAppointment.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() =>
                router.push("/patient/appointment/create-appointment")
              }
              className="w-full p-4 border-2 border-dashed rounded-lg text-center hover:border-blue-500 group"
            >
              <div className="flex items-center justify-center gap-2 text-gray-600 group-hover:text-blue-500">
                <Plus size={20} />
                <span>Schedule New Appointment</span>
              </div>
            </button>
          )}
        </div>

        {/* Recent Results */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Recent Results
            </h2>
            <button
              onClick={() => router.push("/patient/test-results")}
              className="text-blue-500 hover:text-blue-600 text-sm flex items-center gap-1"
            >
              View All
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="space-y-3">
            {results.length > 0 ? (
              results.slice(-1).map((result, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg border hover:border-blue-500 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <FileText size={20} className="text-green-600" />
                    </div>
                    <div>
                      <h1 className=" font-medium text-green-600">
                        {result.labName}
                      </h1>
                      <h3 className="font-medium text-gray-800">
                        {result.tests}
                      </h3>
                      <p className="text-sm text-gray-600">{result.date}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500">
                No recent test results
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
