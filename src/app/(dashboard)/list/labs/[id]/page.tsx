/* eslint-disable @next/next/no-img-element */
import Announcements from "@/components/Announcements";
import BigCalendar from "@/components/BigCalendar";
import Performance from "@/components/Performance";
import { labsData, role } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";

interface LabDetailsProps {
  params: {
    id: string;
  };
}

const SingleLabPage = ({ params }: LabDetailsProps) => {
  const id = parseInt(params.id, 10);
  const labs = labsData.find((lab) => lab.id === id);
  console.log(labs);

  return (
    <div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3">
        {/* TOP */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* USER INFO CARD */}
          <div className="bg-lamaSky py-6 px-4 rounded-md flex-1 flex gap-4">
            <div className="w-1/3">
              <img
                src={labs?.photo}
                alt=""
                width={144}
                height={144}
                className="w-36 h-36 rounded-full object-cover"
              />
            </div>
            <div className="w-2/3 flex flex-col justify-between gap-4">
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-semibold">{labs?.name}</h1>
               
              </div>
              <p className="text-sm text-gray-500">{labs?.location}</p>
              <div className="flex items-center  gap-2 flex-wrap text-xs font-medium">
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/blood.png" alt="" width={14} height={14} />
                  <span>{labs?.testsAvailable}</span>
                </div>

                <div className="w-full flex items-center flex-col gap-2">
                  <div className="w-full  flex items-center gap-2">
                    {" "}
                    <Image src="/phone.png" alt="" width={14} height={14} />
                    <span>{labs?.phone}</span>
                  </div>
                  <div className="w-full  flex items-center gap-2">
                    <Image src="/mail.png" alt="" width={14} height={14} />
                    <span>{labs?.email}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* SMALL CARDS */}
          <div className="flex-1 flex gap-4 justify-between flex-wrap">
            {/* CARD */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image
                src="/singleAttendance.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div className="">
                <h1 className="text-xl font-semibold">90</h1>
                <span className="text-sm text-gray-400">Total tests</span>
              </div>
            </div>
            {/* CARD */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image
                src="/singleBranch.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div className="">
                <h1 className="text-xl font-semibold">2</h1>
                <span className="text-sm text-gray-400">Ongoing</span>
              </div>
            </div>
            {/* CARD */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image
                src="/singleLesson.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div className="">
                <h1 className="text-xl font-semibold">6</h1>
                <span className="text-sm text-gray-400">Pending</span>
              </div>
            </div>
            {/* CARD */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image
                src="/singleClass.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div className="">
                <h1 className="text-xl font-semibold">Active</h1>
                <span className="text-sm text-gray-400">Status</span>
              </div>
            </div>
          </div>
        </div>
        {/* BOTTOM */}
        <div className="mt-4 bg-white rounded-md p-4 h-[800px]">
          <h1>{labs?.name}&apos;s Schedule</h1>
          <BigCalendar />
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-4">
        <div className="bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Quick Actions</h1>
          <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500">
            <Link className="p-3 rounded-md bg-blue-100" href="/labs/tests">
              Lab Tests
            </Link>
            <Link className="p-3 rounded-md bg-green-100" href="/labs/reports">
              Lab Reports
            </Link>
            <Link
              className="p-3 rounded-md bg-yellow-100"
              href="/labs/appointments"
            >
              Appointments
            </Link>

            <Link className="p-3 rounded-md bg-blue-100" href="/labs/tests">
              Patients
            </Link>
            <Link className="p-3 rounded-md bg-green-100" href="/labs/reports">
              Doctors
            </Link>
          </div>
        </div>
        <Performance />
        <Announcements />
      </div>
    </div>
  );
};

export default SingleLabPage;
