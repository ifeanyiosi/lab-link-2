"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

// Sample dynamic announcements data for admin
const fetchAnnouncements = async () => {
  // Simulating a fetch request to get announcements
  return [
    {
      id: 1,
      title: "Lab Maintenance Notice",
      date: "2025-02-01",
      description:
        "Our laboratory systems will undergo maintenance on the first of February. Please plan accordingly.",
      backgroundColor: "bg-lamaSkyLight",
    },
    {
      id: 2,
      title: "New Test Available",
      date: "2025-02-05",
      description:
        "We have added a new test for diabetic patients. Check the details on your dashboard.",
      backgroundColor: "bg-lamaPurpleLight",
    },
    {
      id: 3,
      title: "Updated Lab Guidelines",
      date: "2025-02-10",
      description:
        "The lab guidelines have been updated. Please make sure to familiarize yourself with the new protocols.",
      backgroundColor: "bg-lamaYellowLight",
    },
  ];
};

const Announcements = () => {
  const [announcements, setAnnouncements] = useState<any[]>([]);

  // Fetch announcements data on component mount
  useEffect(() => {
    const getAnnouncements = async () => {
      const data = await fetchAnnouncements();
      setAnnouncements(data);
    };

    getAnnouncements();
  }, []);

  return (
    <div className="bg-white p-4 rounded-md">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Announcements</h1>
        <span className="text-xs text-gray-400 cursor-pointer">View All</span>
      </div>

      <div className="flex flex-col gap-4 mt-4">
        {announcements.length > 0 ? (
          announcements.map((announcement) => (
            <div
              key={announcement.id}
              className={`${announcement.backgroundColor} rounded-md p-4`}
            >
              <div className="flex items-center justify-between">
                <h2 className="font-medium">{announcement.title}</h2>
                <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
                  {announcement.date}
                </span>
              </div>
              <p className="text-sm text-gray-400 mt-1">
                {announcement.description}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm">
            No announcements at the moment.
          </p>
        )}
      </div>
    </div>
  );
};

export default Announcements;
