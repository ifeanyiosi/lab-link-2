"use client";

import React from "react";
import {
  Calendar,
  Microscope,
  Activity,
  Clock,
  ChevronRight,
  Filter,
  Download,
  MoreHorizontal,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useAuth } from "@/context/AuthContext";

const activityData = [
  { name: "Mon", tests: 28, results: 22 },
  { name: "Tue", tests: 35, results: 30 },
  { name: "Wed", tests: 42, results: 38 },
  { name: "Thu", tests: 31, results: 28 },
  { name: "Fri", tests: 38, results: 35 },
  { name: "Sat", tests: 25, results: 22 },
  { name: "Sun", tests: 20, results: 18 },
];

const LabDashboardPage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.labName}!
          </h1>
          <p className="text-gray-500 mt-1">
            Here&apos;s what&apos;s happening in your lab today.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="w-4 h-4 inline mr-2" />
            Export Report
          </button>
          <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
            + New Test Order
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-green-600">+12.5%</span>
          </div>
          <h3 className="text-2xl font-bold mt-4">24</h3>
          <p className="text-gray-500 text-sm">Today&apos;s Appointments</p>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-green-100 rounded-lg">
              <Microscope className="h-6 w-6 text-green-600" />
            </div>
            <span className="text-sm font-medium text-green-600">+8.1%</span>
          </div>
          <h3 className="text-2xl font-bold mt-4">42</h3>
          <p className="text-gray-500 text-sm">Test Orders</p>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Activity className="h-6 w-6 text-purple-600" />
            </div>
            <span className="text-sm font-medium text-red-600">-2.4%</span>
          </div>
          <h3 className="text-2xl font-bold mt-4">38</h3>
          <p className="text-gray-500 text-sm">Results Processed</p>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <span className="text-sm font-medium text-green-600">+5.2%</span>
          </div>
          <h3 className="text-2xl font-bold mt-4">98.5%</h3>
          <p className="text-gray-500 text-sm">Success Rate</p>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders Table */}
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            <div className="p-6 flex justify-between items-center border-b">
              <h2 className="text-lg font-semibold">Recent Orders</h2>
              <div className="flex gap-2">
                <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
                  <Filter className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Patient
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Test Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[
                    {
                      id: "#12345",
                      name: "John Doe",
                      test: "Blood Test",
                      status: "completed",
                      date: "2025-01-31",
                    },
                    {
                      id: "#12346",
                      name: "Jane Smith",
                      test: "X-Ray",
                      status: "in-progress",
                      date: "2025-01-31",
                    },
                    {
                      id: "#12347",
                      name: "Alice Johnson",
                      test: "MRI",
                      status: "pending",
                      date: "2025-01-31",
                    },
                    {
                      id: "#12348",
                      name: "Bob Wilson",
                      test: "CT Scan",
                      status: "completed",
                      date: "2025-01-31",
                    },
                  ].map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.test}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${
                            order.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : order.status === "in-progress"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900">
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Activity Overview */}
        <div className="lg:col-span-1">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Activity Overview</h2>
              <select className="text-sm border rounded-lg px-2 py-1">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
              </select>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="tests"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    dot={{ stroke: "#3B82F6", strokeWidth: 2, fill: "#fff" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="results"
                    stroke="#10B981"
                    strokeWidth={2}
                    dot={{ stroke: "#10B981", strokeWidth: 2, fill: "#fff" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Tests</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Results</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LabDashboardPage;
