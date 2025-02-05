"use client";

import React, { useState, FormEvent, useEffect } from "react";
import { Send, MessageCircle, Users, Filter } from "lucide-react";
import { db } from "@/firebase/firebaseConfig";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { toast } from "react-toastify";

type UserType = "labs" | "patients" | "both";

interface Announcement {
  id: string;
  title: string;
  message: string;
  targetUsers: UserType;
  timestamp: Date;
}

const AnnouncementManagement: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [currentAnnouncement, setCurrentAnnouncement] = useState<
    Omit<Announcement, "id" | "timestamp">
  >({
    title: "",
    message: "",
    targetUsers: "both",
  });
  const [selectedFilter, setSelectedFilter] = useState<UserType | "all">("all");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const q =
      selectedFilter === "all"
        ? query(collection(db, "announcements"))
        : query(
            collection(db, "announcements"),
            where("targetUsers", "==", selectedFilter)
          );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const anns = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate(),
      })) as Announcement[];
      setAnnouncements(anns);
    });

    return () => unsubscribe();
  }, [selectedFilter]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, "announcements"), {
        ...currentAnnouncement,
        timestamp: serverTimestamp(),
      });

      setCurrentAnnouncement({
        title: "",
        message: "",
        targetUsers: "both",
      });

      toast.success("Announcement sent successfully!");
    } catch (error) {
      console.error("Error sending announcement:", error);
      toast.error("Failed to send announcement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Announcement Creation Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <MessageCircle className="mr-3 text-blue-600" />
            Create Announcement
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Announcement Title
              </label>
              <input
                type="text"
                value={currentAnnouncement.title}
                onChange={(e) =>
                  setCurrentAnnouncement((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Announcement Message
              </label>
              <textarea
                value={currentAnnouncement.message}
                onChange={(e) =>
                  setCurrentAnnouncement((prev) => ({
                    ...prev,
                    message: e.target.value,
                  }))
                }
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 h-32"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Target Users
              </label>
              <div className="flex space-x-4 mt-2">
                {(["labs", "patients", "both"] as UserType[]).map((type) => (
                  <label key={type} className="inline-flex items-center">
                    <input
                      type="radio"
                      value={type}
                      checked={currentAnnouncement.targetUsers === type}
                      onChange={() =>
                        setCurrentAnnouncement((prev) => ({
                          ...prev,
                          targetUsers: type,
                        }))
                      }
                      className="form-radio"
                    />
                    <span className="ml-2 capitalize">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            >
              <Send className="mr-2" size={18} />
              {loading ? "Sending..." : "Send Announcement"}
            </button>
          </form>
        </div>

        {/* Announcements List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold flex items-center">
              <Users className="mr-3 text-green-600" />
              Previous Announcements
            </h2>
            <div className="flex items-center space-x-2">
              <Filter size={18} className="text-gray-500" />
              <select
                value={selectedFilter}
                onChange={(e) =>
                  setSelectedFilter(e.target.value as UserType | "all")
                }
                className="border rounded-md p-1 text-sm"
              >
                <option value="all">All Users</option>
                <option value="labs">Labs</option>
                <option value="patients">Patients</option>
                <option value="both">Both</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {announcements.map((announcement) => (
              <div
                key={announcement.id}
                className="border rounded-lg p-4 hover:bg-gray-50"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-lg">
                    {announcement.title}
                  </h3>
                  <span className="text-sm text-gray-500 capitalize">
                    {announcement.targetUsers}
                  </span>
                </div>
                <p className="text-gray-600 mb-2">{announcement.message}</p>
                <div className="text-xs text-gray-400">
                  {announcement.timestamp?.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementManagement;
