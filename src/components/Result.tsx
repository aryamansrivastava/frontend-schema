import { useEffect, useState } from "react";
import axios from "axios";
import { FiSearch, FiArrowDown, FiArrowUp } from "react-icons/fi";

const StudentResult = () => {
  const [results, setResults] = useState([]);
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "student.name",
    direction: "ascending",
  });

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/results");
      setResults(response.data);
    } catch (error) {
      console.error("Error fetching results:", error);
    }
  };

  const filteredResults = results.filter(
    (result: any) =>
      (result.student?.name?.toLowerCase() || "").includes(
        search.toLowerCase()
      ) ||
      (result.exam?.name?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (result.faculty?.name?.toLowerCase() || "").includes(search.toLowerCase())
  );

  const sortedResults = [...filteredResults].sort((a, b) => {
    if (sortConfig.key === "status" || sortConfig.key === "faculty.name") {
      return 0;
    }
    const [aValue, bValue] = sortConfig.key
      .split(".")
      .reduce((obj, key) => [obj[0][key], obj[1][key]], [a, b]);

    if (aValue < bValue) return sortConfig.direction === "ascending" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "ascending" ? 1 : -1;
    return 0;
  });

  const handleSort = (column: string) => {
    let direction = "ascending";
    if (sortConfig.key === column && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key: column, direction });
  };

  const renderSortIcon = (column: string) => {
    if (column === "faculty.name" || column === "status") return null;

    if (sortConfig.key === column) {
      return sortConfig.direction === "ascending" ? (
        <FiArrowUp size={16} className="text-blue-500" />
      ) : (
        <FiArrowDown size={16} className="text-blue-500" />
      );
    }
    return (
      <div className="text-gray-300 opacity-50">
        <FiArrowUp size={16} />
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex justify-between items-center mb-3 p-4 rounded-lg bg-white">
      <h2 className="text-3xl font-bold text-gray-800">
        Student Results
      </h2>
      </div>
      <div className="flex flex-col bg-white p-4 rounded-lg shadow-lg border border-gray-300 flex-1 overflow-y-auto">
        <div className="relative max-w-[200px] mb-3">
          <FiSearch
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            size={20}
          />
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 pl-5 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 text-gray-900 bg-gray-50 hover:bg-gray-100 transition duration-300 ease-in-out"
          />
        </div>

        <div className="flex-1 overflow-auto">
          <table className="w-full border-collapse min-w-[600px] border border-gray-200">
            <thead>
              <tr className="bg-gray-800 text-white">
                {[
                  "student.name",
                  "exam.name",
                  "marks",
                  "cgpa",
                  "result_Date",
                  "status",
                  "faculty.name",
                ].map((column) => (
                  <th
                    key={column}
                    className="border border-gray-300 p-3 cursor-pointer"
                    onClick={() => handleSort(column)}
                  >
                    <div className="flex items-center justify-between">
                      <span>
                        {column === "student.name" && "Student Name"}
                        {column === "exam.name" && "Exam"}
                        {column === "marks" && "Marks"}
                        {column === "cgpa" && "CGPA"}
                        {column === "result_Date" && "Result Date"}
                        {column === "status" && "Status"}
                        {column === "faculty.name" && "Faculty Name"}
                      </span>
                      {renderSortIcon(column)}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedResults.length > 0 ? (
                sortedResults.map((result: any, index: number) => (
                  <tr
                    key={result.id}
                    className={`text-center border-b border-gray-300 ${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-gray-200 transition-all`}
                  >
                    <td className="border border-gray-300 p-3 text-gray-900 font-semibold">
                      {result.student.name}
                    </td>
                    <td className="border border-gray-300 p-3 text-gray-800">
                      {result.exam.subject}
                    </td>
                    <td className="border border-gray-300 p-3 text-gray-800">
                      {result.marks}
                    </td>
                    <td className="border border-gray-300 p-3 text-gray-800">
                      {result.cgpa}
                    </td>
                    <td className="border border-gray-300 p-3 text-gray-700">
                      {new Date(result.result_Date).toDateString()}
                    </td>
                    <td
                      className={`border border-gray-300 p-3 font-bold ${
                        result.cgpa >= 3.6 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {result.cgpa >= 3.6 ? "Pass" : "Fail"}
                    </td>

                    <td className="border border-gray-300 p-3 text-gray-800">
                      {result.faculties?.name || "N/A"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-4 text-center text-gray-500">
                    No results found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentResult;
