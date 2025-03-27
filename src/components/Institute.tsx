import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { MaterialReactTable, MRT_ColumnDef } from "material-react-table";
import { Button } from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import InstituteForm from "./InstituteForm";
import { exportToExcel } from "../utils/exportToExcel";

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

  const navigate = useNavigate();

  const [institutes, setInstitutes] = useState<Institute[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [search, setSearch] = useState("");
  const [selectedInstitute, setSelectedInstitute] = useState("");

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

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await axios.delete(`http://localhost:5000/api/items/${id}`);
        alert("Item deleted successfully!");
      } catch (error) {
        console.error("Error deleting item:", error);
        alert("Failed to delete item");
      }
    }
  };

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
      {
        accessorKey: "actions",
        header: "Actions",
        Cell: ({ row }) => (
          <div className="flex space-x-2">
            <button
              className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
              // onClick={() => handleEdit(row.original)}
            >
              Edit
            </button>
            <button
              className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
              onClick={() => handleDelete(row.original.id)}
            >
              Delete
            </button>
          </div>
        ),
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
  const handleExportToExcel = () => {
    exportToExcel(institutes, columns);
  };

  return (
    <div className="p-2 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-3 p-4 rounded-lg bg-white">
        <h2 className="text-3xl font-bold text-gray-800">Institutes</h2>
        
        <div className="flex space-x-4">
          <Button
            variant="contained"
            onClick={() => setOpen(true)}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            sx={{
              textTransform: "none",
              padding: "8px 16px",
              borderRadius: "8px",
            }}
          >
             Add Institute
          </Button>
  
          <Button
            variant="contained"
            onClick={handleExportToExcel}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            sx={{
              textTransform: "none",
              padding: "8px 16px",
              borderRadius: "8px",
            }}
          >
            Export Data
          </Button>
        </div>
      </div>
  
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      <div className="bg-white p-4 rounded-lg overflow-auto max-h-[calc(100vh-150px)]">
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
          sx: { cursor: "pointer", "&:hover": { backgroundColor: "white" } },
        })}
        muiTableContainerProps={{
          sx: { backgroundColor: "white", borderRadius: "8px", overflow: "hidden" },
        }}
        muiPaginationProps={{
          sx: { backgroundColor: "white", padding: "8px" },
        }}
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
       </div>
  
      <InstituteForm
        open={open}
        onClose={() => setOpen(false)}
        institute={newInstitute}
        onChange={handleInputChange}
        onSubmit={handleAddInstitute}
      />
    </div>
  );
}