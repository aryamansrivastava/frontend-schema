import { useEffect, useState } from "react"
import axios from "axios"
import Graph from "./Graph"
import { Search } from "lucide-react"

interface Student {
  id: number
  name: string
  email: string
  course?: {
    name: string
  }
}

interface Faculty {
  id: number
  name: string
  email: string
  qualification: string
}

const Dashboard = ({ initialInstituteId }: { initialInstituteId?: number }) => {
  const [totalStudents, setTotalStudents] = useState<number>(0)
  const [totalFacultyToday, setTotalFacultyToday] = useState<number>(0)
  const [students, setStudents] = useState<Student[]>([])
  const [faculty, setFaculty] = useState<Faculty[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [instituteId, setInstituteId] = useState<number | undefined>(initialInstituteId)
  const [inputInstituteId, setInputInstituteId] = useState<string>(initialInstituteId?.toString() || "")

  useEffect(() => {
    if (instituteId) {
      fetchData()
    } else {
      fetchTotalStudents()
      fetchTotalFaculty()
    }
  }, [instituteId])

  const handleInstituteSearch = () => {
    const id = Number.parseInt(inputInstituteId)
    if (!isNaN(id)) {
      setInstituteId(id)
      setError(null)
    } else {
      setError("Please enter a valid institute ID")
    }
  }

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [studentsResponse, facultyResponse] = await Promise.all([
        axios.get(`http://localhost:5000/api/students/${instituteId}`),
        axios.get(`http://localhost:5000/api/faculties/${instituteId}`),
      ])

      const studentsData = Array.isArray(studentsResponse.data) ? studentsResponse.data : [studentsResponse.data]
      const facultyData = Array.isArray(facultyResponse.data) ? facultyResponse.data : [facultyResponse.data]

      setStudents(studentsData)
      setFaculty(facultyData)
      setTotalStudents(studentsData.length)
      setTotalFacultyToday(facultyData.length)

      setLoading(false)
    } catch (error) {
      console.error("Error fetching data:", error)
      setLoading(false)
    }
  }

  const fetchTotalStudents = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/students")
      setTotalStudents(response.data.total)
    } catch (error) {
      console.error("Error fetching total students:", error)
    }
  }

  const fetchTotalFaculty = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/faculties")
      setTotalFacultyToday(response.data.length)
    } catch (error) {
      console.error("Error fetching total faculty today:", error)
    }
  }

  const chartData = [
    { category: "Total Students", value: totalStudents },
    { category: "Total Faculties", value: totalFacultyToday },
  ]

  return (
    <div className="dashboard flex h-screen">
      <main className="flex-1 p-6 bg-gray-100">
        <header className="bg-white p-4 shadow-md rounded-md mb-4 border border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Welcome</h2>
              <p className="text-gray-600">Today's Date: {new Date().toDateString()}</p>
            </div>
            <div className="mt-3 md:mt-0 flex items-center gap-2">
              <input
                type="number"
                placeholder="Enter Institute ID"
                value={inputInstituteId}
                onChange={(e) => setInputInstituteId(e.target.value)}
                className="w-40 md:w-48 border border-gray-300 p-2 rounded-md text-black"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleInstituteSearch()
                  }
                }}
              />
              <button
                onClick={handleInstituteSearch}
                className="flex items-center gap-1 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                <Search className="h-4 w-4" />
                <span>Search</span>
              </button>
            </div>
          </div>
          {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
          {instituteId && (
            <div className="mt-2 text-sm text-blue-600">Showing data for Institute ID: {instituteId}</div>
          )}
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-500 text-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-lg font-semibold">
              {instituteId ? "Faculty at Institute" : "Total Faculty Present Today"}
            </h3>
            <p className="text-2xl font-bold">{totalFacultyToday}</p>
          </div>
          <div className="bg-green-500 text-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-lg font-semibold">
              {instituteId ? "Students at Institute" : "Total Students Present Today"}
            </h3>
            <p className="text-2xl font-bold">{totalStudents}</p>
          </div>
        </section>

        <section className="bg-white p-4 rounded-md shadow-md border border-gray-200">
          <h3 className="text-lg font-bold mb-3 text-gray-800">
            {instituteId ? `Institute #${instituteId} Statistics` : "Student Statistics"}
          </h3>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p>Loading data...</p>
            </div>
          ) : (
            <Graph chartData={chartData} />
          )}
        </section>
      </main>
    </div>
  )
}

export default Dashboard