// components/LabSidebar.tsx
"use client";

import {
  Gauge,
  TestTube2,
  AlertCircle,
  Droplets,
  CalendarClock,
} from "lucide-react";
import { useEffect, useState } from "react";
import { BarChart, Bar, ResponsiveContainer } from "recharts";
import { Progress } from "./ui/progress";

const data = [
  { name: "Mon", tests: 12 },
  { name: "Tue", tests: 18 },
  { name: "Wed", tests: 8 },
  { name: "Thu", tests: 15 },
  { name: "Fri", tests: 20 },
];

export default function LabSidebar() {
  const [equipmentStatus, setEquipmentStatus] = useState(85);
  const [inventoryLevel, setInventoryLevel] = useState(42);

  useEffect(() => {
    const interval = setInterval(() => {
      setEquipmentStatus(Math.floor(Math.random() * 20 + 75));
      setInventoryLevel(Math.floor(Math.random() * 20 + 30));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Stats Card */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Gauge className="w-6 h-6 text-primary" />
          Lab Overview
        </h3>

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Equipment Status</span>
              <span className="text-sm font-medium text-primary">
                {equipmentStatus}%
              </span>
            </div>
            <Progress value={equipmentStatus} className="h-2 bg-gray-100" />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Inventory Level</span>
              <span className="text-sm font-medium text-primary">
                {inventoryLevel}%
              </span>
            </div>
            <Progress value={inventoryLevel} className="h-2 bg-gray-100" />
          </div>
        </div>
      </div>

      {/* Test Volume Card */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
          <TestTube2 className="w-6 h-6 text-primary" />
          Weekly Test Volume
        </h3>
        <div className="h-[120px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <Bar
                dataKey="tests"
                fill="#3B82F6"
                radius={[4, 4, 0, 0]}
                className="hover:fill-primary/90 transition-colors"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Alerts Card */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
          <AlertCircle className="w-6 h-6 text-red-500" />
          Urgent Alerts
        </h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Droplets className="w-5 h-5 text-red-500 mt-1" />
            <div>
              <h4 className="font-medium text-sm">Low Reagent Stock</h4>
              <p className="text-xs text-gray-500">
                Hematology reagent needs restocking
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CalendarClock className="w-5 h-5 text-amber-500 mt-1" />
            <div>
              <h4 className="font-medium text-sm">Scheduled Maintenance</h4>
              <p className="text-xs text-gray-500">
                Centrifuge #2 maintenance due tomorrow
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
