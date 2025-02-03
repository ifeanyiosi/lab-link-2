// components/LabAnnouncements.tsx
"use client";

import { useState } from "react";
import { AlertCircle, Megaphone, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Announcement {
  id: string;
  title: string;
  date: string;
  priority: "high" | "medium" | "low";
  content: string;
}

export default function LabAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([
    {
      id: "1",
      title: "New Safety Protocols",
      date: "2024-03-20",
      priority: "high",
      content: "All staff must complete new biosafety training by Friday.",
    },
    {
      id: "2",
      title: "Equipment Maintenance",
      date: "2024-03-19",
      priority: "medium",
      content: "Centrifuge #3 will be offline for maintenance tomorrow.",
    },
  ]);

  const [newAnnouncement, setNewAnnouncement] = useState("");
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <Megaphone className="w-6 h-6 text-primary" />
          Lab Announcements
        </h2>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
        >
          + New Announcement
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6 p-4 bg-blue-50 rounded-lg"
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium">New Announcement</h3>
              <button onClick={() => setShowForm(false)}>
                <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
              </button>
            </div>
            <input
              type="text"
              value={newAnnouncement}
              onChange={(e) => setNewAnnouncement(e.target.value)}
              className="w-full p-2 rounded border border-gray-200 mb-2"
              placeholder="Enter announcement..."
            />
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90">
                Post
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        <AnimatePresence>
          {announcements.map((announcement) => (
            <motion.div
              key={announcement.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-4 rounded-lg border border-gray-100 hover:border-primary/30 transition-all group relative"
            >
              <div className="flex items-start gap-3">
                <div
                  className={`pt-1 ${
                    announcement.priority === "high"
                      ? "text-red-500"
                      : announcement.priority === "medium"
                      ? "text-amber-500"
                      : "text-green-500"
                  }`}
                >
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-gray-800">
                      {announcement.title}
                    </h3>
                    <span className="text-sm text-gray-500">
                      {announcement.date}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">
                    {announcement.content}
                  </p>
                </div>
                <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded">
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
