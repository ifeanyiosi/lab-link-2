"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Calendar, FileText, AlertCircle, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { formatDistanceToNow, isValid } from "date-fns";

interface Appointment {
  id: string;
  date: string;
  time: string;
  status: "pending" | "confirmed" | "completed" | "canceled";
  tests: string[];
  labName: string;
  userId: string;
}

interface Result {
  date: string;
  tests: string[];
  labName: string;
  uploadedAt: Date | Timestamp;
}

const RightSidebar = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [healthReminders, setHealthReminders] = useState<string[]>([]);
  const [stats, setStats] = useState({
    completedTests: 0,
    pendingResults: 0,
    nextAppointment: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.uid) return;

      try {
        // Fetch appointments
        const appointmentsRef = collection(db, "appointments");
        const appointmentsQuery = query(
          appointmentsRef,
          where("userId", "==", user.uid),
          where("status", "in", ["pending", "confirmed", "completed"]),
          orderBy("date")
        );
        const appointmentsSnapshot = await getDocs(appointmentsQuery);
        const userAppointments = appointmentsSnapshot.docs.map(
          (doc) => ({ ...doc.data(), id: doc.id } as Appointment)
        );

        // Fetch latest test result
        const resultsRef = collection(db, "users", user.uid, "results");
        const resultsQuery = query(
          resultsRef,
          orderBy("uploadedAt", "desc"),
          limit(1)
        );
        const resultsSnapshot = await getDocs(resultsQuery);
        const firstResult = resultsSnapshot.docs[0]?.data() as
          | Result
          | undefined;

        // Build notifications
        const newNotifications = [];

        // Find first upcoming appointment
        const firstUpcomingAppointment = userAppointments.find((apt) =>
          ["pending", "confirmed"].includes(apt.status)
        );

        if (firstUpcomingAppointment) {
          const appointmentDate = new Date(firstUpcomingAppointment.date);
          if (isValid(appointmentDate)) {
            newNotifications.push({
              type: "appointment",
              message: `Upcoming ${firstUpcomingAppointment.tests.join(
                ", "
              )} at ${firstUpcomingAppointment.labName}`,
              time: formatDistanceToNow(appointmentDate, { addSuffix: true }),
              icon: Calendar,
              status:
                firstUpcomingAppointment.status === "pending"
                  ? "warning"
                  : "success",
            });
          } else {
            console.error(
              "Invalid appointment date:",
              firstUpcomingAppointment.date
            );
          }
        }

        if (firstResult?.uploadedAt) {
          const uploadedAtDate =
            firstResult.uploadedAt instanceof Timestamp
              ? firstResult.uploadedAt.toDate()
              : new Date(firstResult.uploadedAt);

          if (isValid(uploadedAtDate)) {
            newNotifications.push({
              type: "result",
              message: `New ${firstResult.tests.join(
                ", "
              )} results available from ${firstResult.labName}`,
              time: formatDistanceToNow(uploadedAtDate, { addSuffix: true }),
              icon: FileText,
              status: "success",
            });
          } else {
            console.error("Invalid uploadedAt date:", firstResult.uploadedAt);
          }
        }

        setNotifications(newNotifications);

        // Build health reminders
        const reminders = [];
        if (firstUpcomingAppointment?.status === "pending") {
          reminders.push("Fasting required for upcoming blood work");
        }

        if (
          !userAppointments.some((apt) => apt.tests.includes("Physical Exam"))
        ) {
          reminders.push("Schedule annual physical examination");
        }

        setHealthReminders(reminders);

        // Calculate stats
        const completedAppointments = userAppointments.filter(
          (apt) => apt.status === "completed"
        );
        const pendingAppointments = userAppointments.filter((apt) =>
          ["pending", "confirmed"].includes(apt.status)
        );

        setStats({
          completedTests: completedAppointments.length,
          pendingResults: pendingAppointments.length,
          nextAppointment: firstUpcomingAppointment?.date
            ? new Date(firstUpcomingAppointment.date).toLocaleDateString()
            : "No upcoming appointments",
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.uid]);

  if (loading) {
    return (
      <div className="lg:w-80 w-full flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="lg:w-80 w-full space-y-6">
      {/* Notifications */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">
              Notifications
            </CardTitle>
            {notifications.length > 0 && (
              <span className="bg-blue-100 text-blue-600 text-xs font-medium px-2 py-1 rounded-full">
                {notifications.length} New
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notifications.length > 0 ? (
              notifications.map((notification, index) => {
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
              })
            ) : (
              <p className="text-sm text-gray-500 text-center">
                No new notifications
              </p>
            )}
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
            {healthReminders.length > 0 ? (
              healthReminders.map((reminder, index) => (
                <div key={index} className="flex items-start gap-2">
                  <AlertCircle size={16} className="text-blue-500 mt-0.5" />
                  <p className="text-sm text-gray-600">{reminder}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center">
                No current reminders
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RightSidebar;
