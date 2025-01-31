import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Bell,
  Calendar,
  FileText,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

const RightSidebar = () => {
  // Sample data - replace with real data
  const notifications = [
    {
      type: "appointment",
      message: "Upcoming blood work appointment tomorrow at 10:30 AM",
      time: "1h ago",
      icon: Calendar,
      status: "warning",
    },
    {
      type: "result",
      message: "New test results available: Cholesterol Panel",
      time: "3h ago",
      icon: FileText,
      status: "success",
    },
  ];

  const healthReminders = [
    "Fasting required for upcoming blood work",
    "Schedule annual physical examination",
    "Update medical history",
  ];

  return (
    <div className="w-80 space-y-6 px-4 ">
      {/* Notifications Section */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">
              Notifications
            </CardTitle>
            <span className="bg-blue-100 text-blue-600 text-xs font-medium px-2 py-1 rounded-full">
              {notifications.length} New
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notifications.map((notification, index) => {
              const IconComponent = notification.icon;
              return (
                <div
                  key={index}
                  className="flex gap-3 items-start border-b last:border-0 pb-3 last:pb-0"
                >
                  <div
                    className={`p-2 rounded-lg ${
                      notification.status === "warning"
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    <IconComponent size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">
                      {notification.message}
                    </p>
                    <span className="text-xs text-gray-500 mt-1">
                      {notification.time}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Health Reminders */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">
            Health Reminders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {healthReminders.map((reminder, index) => (
              <div key={index} className="flex items-start gap-2">
                <AlertCircle size={16} className="text-blue-500 mt-0.5" />
                <p className="text-sm text-gray-600">{reminder}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">
            Lab Visit Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Completed Tests</span>
              <span className="font-medium text-gray-800">12</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Pending Results</span>
              <span className="font-medium text-gray-800">2</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Next Appointment</span>
              <span className="text-sm text-blue-600">Feb 2, 2024</span>
            </div>
          </div>s
        </CardContent>
      </Card>
    </div>
  );
};

export default RightSidebar;
