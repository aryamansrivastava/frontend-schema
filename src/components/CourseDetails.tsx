import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Button,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Paper,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
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
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState<
    Student | Faculty | null
  >(null);

  useEffect(() => {
    fetchStudents();
    fetchFaculty();
  }, [courseId]);

  const fetchStudents = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/courses/${courseId}/students`
      );
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const fetchFaculty = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/courses/${courseId}/faculties`
      );
      setFaculty(response.data);
    } catch (error) {
      console.error("Error fetching faculty:", error);
    }
  };

  const studentColumns: MRT_ColumnDef<Student>[] = useMemo(
    () => [
      { accessorKey: "name", header: "Name" },
      { accessorKey: "email", header: "Email" },
      { accessorKey: "semester", header: "Semester" },
      { accessorKey: "cgpa", header: "CGPA" },
    ],
    []
  );

  const facultyColumns: MRT_ColumnDef<Faculty>[] = useMemo(
    () => [
      { accessorKey: "name", header: "Name" },
      { accessorKey: "email", header: "Email" },
      { accessorKey: "qualification", header: "Qualification" },
      { accessorKey: "course", header: "Course" },
      { accessorKey: "specialization", header: "Specialization" },
      { accessorKey: "experience", header: "Experience (Years)" },
      { accessorKey: "salary", header: "Salary ($)" },
    ],
    []
  );

  const handleRowClick = (row: any) => {
    setSelectedRowData(row.original);
    setOpenDialog(true);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Button variant="contained" color="primary" onClick={() => navigate(-1)}>
        Back
      </Button>

      <div className="bg-white p-6 rounded-lg mt-6">
        <div className="flex justify-between items-center mb-4">
          {activeTab === 0 ? (
            <p className="text-lg font-semibold text-black">
              Total Students: {students.length}
            </p>
          ) : (
            <p className="text-lg font-semibold text-black">
              Total Faculty: {faculty.length}
            </p>
          )}
        </div>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
        >
          <Tab label="Students" />
          <Tab label="Faculty" />
        </Tabs>

        {activeTab === 0 ? (
          <MaterialReactTable
            columns={studentColumns}
            data={students}
            muiTableBodyRowProps={({ row }) => ({
              onClick: () => handleRowClick(row),
              style: { cursor: "pointer" },
            })}
          />
        ) : (
          <MaterialReactTable
            columns={facultyColumns}
            data={faculty}
            muiTableBodyRowProps={({ row }) => ({
              onClick: () => handleRowClick(row),
              style: { cursor: "pointer" },
            })}
          />
        )}
      </div>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>
          Details
          <IconButton
            aria-label="close"
            onClick={() => setOpenDialog(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ maxHeight: "400px", overflowY: "auto" }}>
          {selectedRowData && (
            <Paper elevation={3} sx={{ padding: 2 }}>
              <List>
                {Object.entries(selectedRowData)
                  .filter(
                    ([key]) =>
                      key !== "id" &&
                      key !== "course_id" &&
                      key !== "institute_id" &&
                      key !== "createdAt" &&
                      key !== "updatedAt"
                  )
                  .map(([key, value]) => (
                    <ListItem key={key} divider>
                      <ListItemText
                        primary={key.toLowerCase()}
                        secondary={value}
                      />
                    </ListItem>
                  ))}
              </List>
            </Paper>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
