"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Clock,
  FileText,
  Building2,
  Activity,
  Plus,
  ChevronRight,
  Bell,
} from "lucide-react";

const PatientDashboard = () => {
  const { user } = useAuth();
  const router = useRouter();

  // Sample data - replace with real data
  const upcomingAppointment = {
    date: "Feb 2, 2024",
    time: "10:30 AM",
    lab: "Central Lab",
    test: "Blood Work",
  };

  const recentResults = [
    { date: "Jan 28, 2024", test: "Cholesterol Panel", status: "Ready" },
    { date: "Jan 15, 2024", test: "Blood Sugar", status: "Ready" },
  ];

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
          <button className="p-2 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors">
            <Bell size={20} className="text-gray-600" />
          </button>
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

          {upcomingAppointment ? (
            <div className="border rounded-lg p-4">
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Calendar size={24} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800">
                    {upcomingAppointment.test}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {upcomingAppointment.lab}
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
            {recentResults.map((result, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg border hover:border-blue-500 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <FileText size={20} className="text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">{result.test}</h3>
                    <p className="text-sm text-gray-600">{result.date}</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-green-600">
                  {result.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
