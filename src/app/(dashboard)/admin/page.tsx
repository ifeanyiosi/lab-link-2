"use client";

import React, { useEffect, useState } from "react";
import {
  Users,
  Calendar,
  FileText,
  Clock,
  BarChart,
  TrendingUp,
  PieChart,
} from "lucide-react";
import {
  collection,
  query,
  getDocs,
  getCountFromServer,
} from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";

interface Stats {
  totalPatients: number;
  totalAppointments: number;
  completedTests: number;
  pendingTests: number;
  appointmentStatusCounts: {
    pending: number;
    confirmed: number;
    completed: number;
    canceled: number;
  };
}

interface QuickStat {
  icon: React.ElementType;
  title: string;
  value: number;
  color: string;
  change: string;
}

interface AnalyticsCard {
  icon: React.ElementType;
  title: string;
  description: string;
  data?: Record<string, number>;
}

const AdminDashboardHome: React.FC = () => {
  const [stats, setStats] = useState<Stats>({
    totalPatients: 0,
    totalAppointments: 0,
    completedTests: 0,
    pendingTests: 0,
    appointmentStatusCounts: {
      pending: 0,
      confirmed: 0,
      completed: 0,
      canceled: 0,
    },
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersCol = collection(db, "users");
        const usersSnapshot = await getCountFromServer(usersCol);

        const appointmentsCol = collection(db, "appointments");
        const appointmentsSnapshot = await getDocs(appointmentsCol);

        const statusCounts: Stats["appointmentStatusCounts"] = {
          pending: 0,
          confirmed: 0,
          completed: 0,
          canceled: 0,
        };

        appointmentsSnapshot.forEach((doc) => {
          const status = doc.data().status?.toLowerCase();
          if (status in statusCounts) {
            statusCounts[status as keyof Stats["appointmentStatusCounts"]] += 1;
          }
        });

        setStats({
          totalPatients: usersSnapshot.data().count || 0,
          totalAppointments: appointmentsSnapshot.size,
          completedTests: statusCounts.completed,
          pendingTests: statusCounts.pending,
          appointmentStatusCounts: statusCounts,
        });

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const quickStats: QuickStat[] = [
    {
      icon: Users,
      title: "Total Patients",
      value: stats.totalPatients,
      color: "bg-blue-500",
      change: "+12.5%",
    },
    {
      icon: Calendar,
      title: "Appointments",
      value: stats.totalAppointments,
      color: "bg-green-500",
      change: "+8.2%",
    },
    {
      icon: FileText,
      title: "Completed Tests",
      value: stats.completedTests,
      color: "bg-purple-500",
      change: "+5.7%",
    },
    {
      icon: Clock,
      title: "Pending Tests",
      value: stats.pendingTests,
      color: "bg-yellow-500",
      change: "-2.3%",
    },
  ];

  const analyticsCards: AnalyticsCard[] = [
    {
      icon: BarChart,
      title: "Appointment Status",
      description: "Distribution of appointment statuses",
      data: stats.appointmentStatusCounts,
    },
    {
      icon: TrendingUp,
      title: "Patient Trends",
      description: "Monthly patient registration trends",
    },
    {
      icon: PieChart,
      title: "Test Distribution",
      description: "Types of tests conducted",
    },
  ];

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          <p className="mt-3 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 bg-gray-50 min-h-screen">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Dashboard Overview
          </h1>
          <p className="text-gray-600">
            Welcome back, Admin. Here&apos;s an overview of your lab&apos;s
            performance.
          </p>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {quickStats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-5 transform transition-all hover:scale-105"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 ${stat.color} text-white rounded-full`}>
                  <stat.icon size={24} />
                </div>
                <span
                  className={`text-sm font-semibold ${
                    stat.change.startsWith("+")
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {stat.change}
                </span>
              </div>
              <div>
                <h3 className="text-gray-500 text-sm mb-1">{stat.title}</h3>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {analyticsCards.map((card, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <card.icon className="text-blue-600" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {card.title}
                </h3>
              </div>
              <p className="text-gray-600 mb-4">{card.description}</p>

              {card.data && (
                <div className="space-y-2">
                  {Object.entries(card.data).map(([status, count]) => (
                    <div key={status} className="flex justify-between">
                      <span className="capitalize">{status}</span>
                      <span className="font-medium">{count}</span>
                    </div>
                  ))}
                </div>
              )}

              <button className="mt-4 w-full py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors">
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardHome;
