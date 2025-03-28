import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Tabs, Tab } from "@mui/material";
import { MaterialReactTable, MRT_ColumnDef } from "material-react-table";

export default function CourseDetails() {
  interface Student {
    id: number;
    name: string;
    email: string;
    semester: string;
    cgpa: number;
  }

  interface Faculty {
    id: number;
    name: string;
    email: string;
    qualification: string;
    course: string;
    specialization: string;
    experience: number;
    salary: number;
  }

  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [activeTab, setActiveTab] = useState<0 | 1>(0);

  useEffect(() => {
    fetchStudents();
    fetchFaculty();
  }, [courseId]);

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/courses/${courseId}/students`);
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const fetchFaculty = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/courses/${courseId}/faculties`);
      setFaculty(response.data);
    } catch (error) {
      console.error("Error fetching faculty:", error);
    }
  };

  const studentColumns: MRT_ColumnDef<Student>[] = useMemo(
    () => [
      { accessorKey: "id", header: "ID", size: 100 },
      { accessorKey: "name", header: "Name", size: 200 },
      { accessorKey: "email", header: "Email", size: 250 },
      { accessorKey: "semester", header: "Semester", size: 150 },
      { accessorKey: "cgpa", header: "CGPA", size: 100 },
    ],
    []
  );

  const facultyColumns: MRT_ColumnDef<Faculty>[] = useMemo(
    () => [
      { accessorKey: "id", header: "ID", size: 80 },
      { accessorKey: "name", header: "Name", size: 200 },
      { accessorKey: "email", header: "Email", size: 250 },
      { accessorKey: "qualification", header: "Qualification", size: 200 },
      { accessorKey: "course", header: "Course", size: 200 },
      { accessorKey: "specialization", header: "Specialization", size: 200 },
      { accessorKey: "experience", header: "Experience (Years)", size: 150 },
      { accessorKey: "salary", header: "Salary ($)", size: 150 },
    ],
    []
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Button variant="contained" color="primary" onClick={() => navigate(-1)}>
        Back
      </Button>

      <div className="bg-white p-6 rounded-lg mt-6">
        <div className="flex justify-between items-center mb-4">
        <p className="text-lg font-semibold text-black">Total Students: {students.length}</p>
        <p className="text-lg font-semibold text-black">Total Faculty: {faculty.length}</p>
        </div>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          className="mb-4"
        >
          <Tab label="Students" />
          <Tab label="Faculty" />
        </Tabs>

        {activeTab === 0 ? (
          <MaterialReactTable
          enableTableHead
          muiTableHeadCellProps={{
            sx: { backgroundColor: '#f5f5f5', fontWeight: 'bold', color: '#333' },
          }}
            columns={studentColumns}
            data={students}
            enablePagination
            enableSorting
            enableGlobalFilter
            enableFilters
            muiTableContainerProps={{
              sx: { boxShadow: 'none', outline: 'none', backgroundColor: 'transparent' },
            }}
          />
        ) : (
          <MaterialReactTable
            columns={facultyColumns}
            data={faculty}
            enablePagination
            enableSorting
            enableGlobalFilter
            enableFilters
          />
        )}
      </div>
    </div>
  );
}
