import { useState, useEffect } from "react";
import axios from "axios";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  FormControl,
  MenuItem,
  Select,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import "./CalendarStyle.css";

interface Institute {
  id: number;
  name: string;
}

interface Attendance {
  id: number;
  studentName: string;
  status: "Present" | "Absent";
  date: string;
}

interface Props {
  instituteId: number;
}

export default function StudentAttendanceCalendar({ instituteId }: Props) {
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [events, setEvents] = useState<
    {
      title: string;
      date: string;
      color: string;
      extendedProps: { presentCount: number };
    }[]
  >([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [studentsOnSelectedDate, setStudentsOnSelectedDate] = useState<
    Attendance[]
  >([]);
  const [institutes, setInstitutes] = useState<Institute[]>([]);
  const [selectedInstituteId, setSelectedInstituteId] = useState<
    number | null
  >();
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth()
  );
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );

  useEffect(() => {
    fetchInstitutes();
  }, []);

  useEffect(() => {
    if (selectedInstituteId) {
      fetchAttendance(selectedInstituteId, selectedMonth, selectedYear);
    }
  }, [selectedInstituteId, selectedMonth, selectedYear]);

  const fetchInstitutes = async () => {
    try {
      let allInstitutes: Institute[] = [];
      let page = 1;
      let totalPages = 1; 
  
      while (page <= totalPages) {
        const response = await axios.get("http://localhost:5000/api/institutes", {
          params: { page, limit: 100 } 
        });
  
        const institutesData = response.data.data || [];
        allInstitutes = allInstitutes.concat(institutesData);
  
        totalPages = response.data.totalPages;
        page++; 
      }
  
      setInstitutes(allInstitutes); 
    } catch (error) {
      console.error("Error fetching institutes:", error);
    }
  };

  const fetchAttendance = async (
    instituteId: number,
    month: number,
    year: number
  ) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/attendances/${instituteId}?month=${
          month + 1
        }&year=${year}`
      );

      const mappedAttendance: Attendance[] =
        response.data.studentAttendance.map((record: any) => ({
          id: record.id,
          studentName:
            record.student?.name || `Student ID: ${record.student_id}`,
          status: record.status === 1 ? "Present" : "Absent",
          date: record.date.split("T")[0],
        }));

      setAttendance(mappedAttendance);

      const attendanceByDate: Record<
        string,
        { present: number; absent: number; students: Attendance[] }
      > = {};

      mappedAttendance.forEach((record) => {
        if (!attendanceByDate[record.date]) {
          attendanceByDate[record.date] = {
            present: 0,
            absent: 0,
            students: [],
          };
        }

        attendanceByDate[record.date].students.push(record);

        if (record.status === "Present") {
          attendanceByDate[record.date].present += 1;
        } else {
          attendanceByDate[record.date].absent += 1;
        }
      });

      const mappedEvents = Object.keys(attendanceByDate).map((date) => ({
        title: `${attendanceByDate[date].present} Present\n${attendanceByDate[date].absent} Absent`,
        date: date,
        color: getColorByAttendance(attendanceByDate[date].present),
        extendedProps: {
          presentCount: attendanceByDate[date].present,
          absentCount: attendanceByDate[date].absent,
        },
      }));

      setEvents(mappedEvents);
    } catch (error) {
      console.error("Error fetching attendance:", error);
    }
  };

  const getColorByAttendance = (count: number) =>
    count >= 5 ? "#8bc34a" : "#f44336";

  const handleDateClick = (info: any) => {
    const clickedDate = info.dateStr;
    setSelectedDate(clickedDate);

    const studentsForDate = attendance.filter(
      (record) => record.date === clickedDate
    );
    setStudentsOnSelectedDate(studentsForDate);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInstituteChange = (event: any) => {
    const newInstituteId = event.target.value;
    setSelectedInstituteId(newInstituteId);
  };

  return (
    <Paper 
      elevation={3}
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        overflow: 'hidden',
        p: 2,
        maxHeight: '100vh'
      }}
    >
      <div
        className="flex"
        style={{
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h5" className="calendar-title">
          Student Attendance
        </Typography>

        <FormControl sx={{ width: 200 }} size="small">
          <Select
            value={selectedInstituteId || ""}
            onChange={handleInstituteChange}
            aria-placeholder="Select Institute"
            displayEmpty
          >
            <MenuItem value="" disabled>
              Select Institute
            </MenuItem>
            {institutes.map((institute) => (
              <MenuItem key={institute.id} value={institute.id}>
                {institute.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      <div style={{ flexGrow: 1, overflow: 'hidden' }}>
      <FullCalendar
      
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        height="100%"
        dateClick={handleDateClick}
        datesSet={(info) => {
          const newMonth = info.start.getMonth() + 1;
          const newYear = info.start.getFullYear();
          setSelectedMonth(newMonth);
          setSelectedYear(newYear);
        }}
        eventContent={(arg) => {
          const eventText = arg.event.title.split("\n");

          return (
            <div style={{ 
              textAlign: "center", 
              fontSize: "10px",
            }}>
              {eventText.map((text, index) => (
                <div
                  key={index}
                  style={{
                    color: text.includes("Present")
                      ? "green"
                      : text.includes("Absent")
                      ? "red"
                      : "black",
                  }}
                >
                  {text}
                </div>
              ))}
            </div>
          );
        }}
      />
      </div>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#f5f5f5",
            padding: "12px 20px",
          }}
        >
          <Typography variant="h6">
            {selectedDate &&
              new Date(selectedDate).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
          </Typography>
          <IconButton onClick={handleCloseDialog}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <List sx={{ maxHeight: "300px", overflowY: "auto" }}>
            {studentsOnSelectedDate.map((student) => (
              <ListItem key={student.id} divider>
                <ListItemText primary={student.studentName} />
                <Typography
                  sx={{
                    fontWeight: "bold",
                    color: student.status === "Present" ? "green" : "red",
                  }}
                >
                  {student.status}
                </Typography>
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>
    </Paper>
  );
}