// components/LabCalendar.tsx
"use client";

import {
  DndContext,
  DragEndEvent,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import { ChevronLeft, ChevronRight, Gauge } from "lucide-react";
import { useState } from "react";
import {
  addDays,
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isToday,
} from "date-fns";
import { CSS } from "@dnd-kit/utilities";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

interface TestEvent {
  id: string;
  testType: string;
  patient: string;
  status: "pending" | "in-progress" | "completed";
  time: string;
  duration: number;
}

interface DraggableRowProps {
  event: TestEvent;
}

function DraggableRow({ event }: DraggableRowProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: event.id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className="hover:bg-gray-50 transition-colors border-t"
    >
      <td className="px-4 py-3 text-sm text-gray-800">
        <div className="flex items-center gap-2">
          <div
            {...listeners}
            {...attributes}
            className="cursor-move p-1 hover:bg-gray-100 rounded"
          >
            <Gauge className="w-4 h-4 text-gray-400" />
          </div>
          {event.testType}
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-gray-800">{event.patient}</td>
      <td className="px-4 py-3 text-sm text-gray-800">
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            event.status === "pending"
              ? "bg-amber-100 text-amber-800"
              : event.status === "in-progress"
              ? "bg-blue-100 text-blue-800"
              : "bg-green-100 text-green-800"
          }`}
        >
          {event.status}
        </span>
      </td>
      <td className="px-4 py-3 text-sm text-gray-800">{event.time}</td>
    </tr>
  );
}

export default function LabCalendar() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<TestEvent[]>([
    {
      id: "1",
      testType: "Blood Panel",
      patient: "John Doe",
      status: "pending",
      time: "09:00",
      duration: 60,
    },
    {
      id: "2",
      testType: "MRI Scan",
      patient: "Jane Smith",
      status: "in-progress",
      time: "11:30",
      duration: 90,
    },
  ]);

  const days = eachDayOfInterval({
    start: startOfWeek(currentDate),
    end: endOfWeek(currentDate),
  });

  const columns: ColumnDef<TestEvent>[] = [
    { accessorKey: "testType", header: "Test Type" },
    { accessorKey: "patient", header: "Patient" },
    { accessorKey: "status", header: "Status" },
    { accessorKey: "time", header: "Time" },
  ];

  const table = useReactTable({
    data: events,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const { setNodeRef: setDroppableRef } = useDroppable({
    id: "calendar-drop-area",
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setEvents((prevEvents) => {
        const oldIndex = prevEvents.findIndex((e) => e.id === active.id);
        const newIndex = prevEvents.findIndex((e) => e.id === over.id);
        const newEvents = [...prevEvents];
        const [removed] = newEvents.splice(oldIndex, 1);
        newEvents.splice(newIndex, 0, removed);
        return newEvents;
      });
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button onClick={() => setCurrentDate(addDays(currentDate, -7))}>
            <ChevronLeft className="w-6 h-6 text-gray-500 hover:text-primary" />
          </button>
          <h2 className="text-xl font-semibold text-gray-800">
            {format(currentDate, "MMMM yyyy")}
          </h2>
          <button onClick={() => setCurrentDate(addDays(currentDate, 7))}>
            <ChevronRight className="w-6 h-6 text-gray-500 hover:text-primary" />
          </button>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-lg bg-blue-50 text-primary font-medium">
            + New Test
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-gray-100 mb-2">
        {days.map((day) => (
          <div key={day.toString()} className="bg-white p-3 text-center">
            <div
              className={`text-sm ${
                isToday(day) ? "text-primary font-bold" : "text-gray-600"
              }`}
            >
              {format(day, "EEE")}
            </div>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                isToday(day) ? "bg-primary text-white" : "text-gray-800"
              }`}
            >
              {format(day, "d")}
            </div>
          </div>
        ))}
      </div>

      <DndContext onDragEnd={handleDragEnd}>
        <div
          ref={setDroppableRef}
          className="border rounded-xl overflow-hidden"
        >
          <table className="w-full">
            <thead className="bg-gray-50">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-3 text-left text-sm font-medium text-gray-500"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <DraggableRow key={row.id} event={row.original} />
              ))}
            </tbody>
          </table>
        </div>
      </DndContext>
    </div>
  );
}
