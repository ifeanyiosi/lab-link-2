import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import {
  resultsData, // Updated data should be lab results-related
  role,
} from "@/lib/data";
import Image from "next/image";

type LabResult = {
  id: number;
  testName: string;
  patient: string;
  doctor: string;
  testDate: string;
  resultDate: string;
  result: string; // Change result to a string to store textual descriptions
};

const columns = [
  {
    header: "Test Name",
    accessor: "testName",
  },
  {
    header: "Patient",
    accessor: "patient",
  },
  {
    header: "Result",
    accessor: "result", // The result is now a string, so this column will display it as text
    className: "hidden md:table-cell",
  },
  {
    header: "Doctor",
    accessor: "doctor",
    className: "hidden md:table-cell",
  },
  {
    header: "Test Date",
    accessor: "testDate",
    className: "hidden md:table-cell",
  },
  {
    header: "Result Date",
    accessor: "resultDate",
    className: "hidden md:table-cell",
  },
  {
    header: "Actions",
    accessor: "action",
  },
];

const ResultListPage = () => {
  const renderRow = (item: LabResult) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">{item.testName}</td>
      <td>{item.patient}</td>
      <td className="hidden md:table-cell">{item.result}</td>{" "}
      {/* Display result as a string */}
      <td className="hidden md:table-cell">{item.doctor}</td>
      <td className="hidden md:table-cell">{item.testDate}</td>
      <td className="hidden md:table-cell">{item.resultDate}</td>
      <td>
        <div className="flex items-center gap-2">
          {role === "admin" ||
            (role === "doctor" && (
              <>
                <FormModal table="result" type="update" data={item} />
                <FormModal table="result" type="delete" id={item.id} />
              </>
            ))}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">
          All Test Results
        </h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {role === "admin" ||
              (role === "doctor" && <FormModal table="result" type="create" />)}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={resultsData} />
      {/* PAGINATION */}
      <Pagination />
    </div>
  );
};

export default ResultListPage;
