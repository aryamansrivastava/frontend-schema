import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  MaterialReactTable,
  MRT_ColumnDef,
  MRT_Row,
} from "material-react-table";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Typography,
  Box,
} from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

export default function Institute() {
  interface Institute {
    id: number;
    name: string;
    email: string;
    address: string;
    contact: string;
    website: string;
    established: string;
  }

  interface Course {
    id: number;
    name: string;
    fees: number;
    duration: number;
  }

  const navigate = useNavigate();

  const [institutes, setInstitutes] = useState<Institute[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [search, setSearch] = useState("");

  const [open, setOpen] = useState(false);
  const [newInstitute, setNewInstitute] = useState({
    name: "",
    email: "",
    address: "",
    contact: "",
    website: "",
    established: "",
  });

  const fetchInstitutes = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/institutes", {
        params: {
          page: page + 1,
          limit: pageSize,
          search,
        },
      });
      console.log("Fetched Institutes:", response.data);
      setInstitutes(response.data.data);
      setTotalRows(response.data.total);
    } catch (err) {
      console.error("Error fetching institutes:", err);
      setError("Failed to load institutes");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchInstitutes();
  }, [page, pageSize, search]);

  const renderDetailPanel = useCallback(
    ({ row }: { row: MRT_Row<Institute> }) => {
      const institute = row.original as Institute;
      const [courses, setCourses] = useState<Course[]>([]);
      const [loadingCourses, setLoadingCourses] = useState<boolean>(true);
      const [coursesError, setCoursesError] = useState<string | null>(null);

      useEffect(() => {
        axios
          .get(`http://localhost:5000/api/courses/institutes/${institute.id}`)
          .then((response) => {
            setCourses(response.data);
            setLoadingCourses(false);
          })
          .catch((err) => {
            console.error("Error fetching courses:", err);
            setCoursesError("Failed to load courses");
            setLoadingCourses(false);
          });
      }, [institute.id]);

      return (
        <div>
          {loadingCourses ? (
            <p>Loading courses...</p>
          ) : coursesError ? (
            <p>{coursesError}</p>
          ) : (
            <ul>
              {courses.map((course) => (
                <li key={course.id}>
                  {course.name} - ${course.fees} - {course.duration} months
                </li>
              ))}
            </ul>
          )}
        </div>
      );
    },
    []
  );

  const columns: MRT_ColumnDef<Institute>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Institute Name",
        size: 200,
      },
      {
        accessorKey: "email",
        header: "Email",
        size: 200,
      },
      {
        accessorKey: "address",
        header: "Address",
        size: 250,
      },
      {
        accessorKey: "contact",
        header: "Contact",
        size: 150,
      },
      {
        accessorKey: "website",
        header: "Website",
        Cell: ({ cell }) => (
          <a
            href={cell.getValue<string>()}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline hover:text-blue-700"
          >
            Visit Website
          </a>
        ),
        size: 200,
      },
      {
        accessorKey: "established",
        header: "Established",
        Cell: ({ cell }) => new Date(cell.getValue<string>()).toDateString(),
        size: 150,
      },
    ],
    []
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const handleRowClick = (row: Institute) => {
    navigate(`/courses/${row.id}`);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewInstitute({ ...newInstitute, [e.target.name]: e.target.value });
  };

  const handleAddInstitute = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/institutes",
        newInstitute
      );
      console.log("Institute added:", response.data);

      fetchInstitutes();
      setOpen(false);
      setNewInstitute({
        name: "",
        email: "",
        address: "",
        contact: "",
        website: "",
        established: "",
      });
      toast.success("Institute added successfully!");
    } catch (err) {
      console.error("Error adding institute:", err);
      setError("Failed to add institute");
      toast.error("Failed to add institute. Please try again.");
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Institutes</h2>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpen(true)}
        >
          Add Institute
        </Button>
      </div>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      <MaterialReactTable
        columns={columns}
        data={institutes}
        enableColumnResizing
        enablePagination
        enableGlobalFilter
        enableSorting
        enableFilters
        rowCount={totalRows}
        manualPagination
        manualFiltering
        muiTableBodyRowProps={({ row }) => ({
          onClick: () => handleRowClick(row.original),
          sx: { cursor: "pointer", "&:hover": { backgroundColor: "#f5f5f5" } },
        })}
        onPaginationChange={(updater) => {
          setPage((prev) => {
            const newState =
              typeof updater === "function"
                ? updater({ pageIndex: prev, pageSize })
                : updater;
            return newState.pageIndex;
          });
          setPageSize((prev) => {
            const newState =
              typeof updater === "function"
                ? updater({ pageIndex: prev, pageSize: prev })
                : updater;
            return newState.pageSize;
          });
        }}
        onGlobalFilterChange={setSearch}
        state={{
          pagination: { pageIndex: page, pageSize },
          globalFilter: search,
        }}
      />

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h5" fontWeight="bold" color="primary">
            Add New Institute
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              padding: "10px",
              backgroundColor: "#f9f9f9",
              borderRadius: "10px",
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Institute Name"
                  name="name"
                  fullWidth
                  value={newInstitute.name}
                  onChange={handleInputChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email"
                  name="email"
                  fullWidth
                  value={newInstitute.email}
                  onChange={handleInputChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Address"
                  name="address"
                  fullWidth
                  value={newInstitute.address}
                  onChange={handleInputChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Contact"
                  name="contact"
                  fullWidth
                  value={newInstitute.contact}
                  onChange={handleInputChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Website"
                  name="website"
                  fullWidth
                  value={newInstitute.website}
                  onChange={handleInputChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="established"
                  type="date"
                  fullWidth
                  value={newInstitute.established}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ padding: "20px" }}>
          <Button
            onClick={() => setOpen(false)}
            variant="outlined"
            color="secondary"
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddInstitute}
            variant="contained"
            color="primary"
          >
            Add Institute
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
