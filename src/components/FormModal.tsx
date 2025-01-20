"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useState } from "react";

// Dynamically importing forms
const LabTechForm = dynamic(() => import("./forms/LabTechForm"), {
  loading: () => <h1>Loading...</h1>,
});
const PatientForm = dynamic(() => import("./forms/PatientForm"), {
  loading: () => <h1>Loading...</h1>,
});

const forms: {
  [key: string]: (type: "create" | "update", data?: any) => JSX.Element;
} = {
  lab: (type, data) => <LabTechForm type={type} data={data} />,
  patient: (type, data) => <PatientForm type={type} data={data} />,
};

const FormModal = ({
  table,
  type,
  data,
  id,
}: {
  table:
    | "patient"
    | "lab"
    | "doctor"
    | "test"
    | "class"
    | "lesson"
    | "exam"
    | "assignment"
    | "result"
    | "attendance"
    | "event"
    | "announcement";
  type: "create" | "update" | "delete";
  data?: any;
  id?: number;
}) => {
  const size = type === "create" ? "w-8 h-8" : "w-7 h-7";
  const bgColor =
    type === "create"
      ? "bg-lamaYellow"
      : type === "update"
      ? "bg-lamaSky"
      : "bg-lamaPurple";

  const [open, setOpen] = useState(false);

  const Form = () => {
    if (type === "delete" && id) {
      return (
        <form action="" className="p-4 flex flex-col gap-4">
          <span className="text-center font-medium">
            All data will be lost. Are you sure you want to delete this {table}?
          </span>
          <button className="bg-red-700 text-white py-2 px-4 rounded-md border-none w-max self-center">
            Delete
          </button>
        </form>
      );
    }

    if (type === "create" || type === "update") {
      if (forms[table]) {
        return forms[table](type, data);
      } else {
        return <span>Form not found for {table}</span>;
      }
    }

    return "Form not found!";
  };

  return (
    <>
      <button
        type="button"
        className={`${size} flex items-center justify-center rounded-full ${bgColor}`}
        onClick={() => setOpen(true)}
      >
        <Image src={`/${type}.png`} alt="" width={16} height={16} />
      </button>
      {open && (
        <div
          className="w-screen h-screen absolute left-0 top-0 bg-black bg-opacity-60 z-50 flex items-center justify-center"
          onClick={() => setOpen(false)} // Close on outside click (optional)
        >
          <div
            className="bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]"
            onClick={(e) => e.stopPropagation()} // Prevent modal close on form click
          >
            <Form />
            <div
              className="absolute top-4 right-4 cursor-pointer"
              onClick={() => setOpen(false)}
            >
              <Image src="/close.png" alt="" width={14} height={14} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FormModal;
