import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { MaterialReactTable, MRT_ColumnDef } from "material-react-table";
import { Button } from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import InstituteForm from "./InstituteForm"

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

  const handleEdit = (data: Institute) => {
  };
  
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
              onClick={() => handleEdit(row.original)}
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
      }
      
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
    <div className="">
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
          sx: { cursor: "pointer", "&:hover": { backgroundColor: "white" } },
        })}
        muiTableContainerProps={{
          sx: { backgroundColor: "white" }, 
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