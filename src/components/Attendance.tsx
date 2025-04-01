import { useState, useEffect } from "react";
import axios from "axios";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import {Dialog,DialogTitle,DialogContent,DialogActions,Button,Paper,Typography,List,ListItem,ListItemText,Chip,Box,IconButton,FormControl,InputLabel,MenuItem,Select,
} from "@mui/material";
import {
  Close as CloseIcon,
} from "@mui/icons-material";
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
  const [selectedInstituteId, setSelectedInstituteId] = useState<number | null>(
    instituteId
  );

  useEffect(() => {
    fetchInstitutes();
  }, []);

  useEffect(() => {
    if (selectedInstituteId) {
      fetchAttendance(selectedInstituteId);
    }
  }, [selectedInstituteId]);

  const currentDate = new Date();
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  )
    .toISOString()
    .split("T")[0];
  const lastDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  )
    .toISOString()
    .split("T")[0];

  const fetchInstitutes = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/institutes");
      setInstitutes(response.data.data || []);
    } catch (error) {
      console.error("Error fetching institutes:", error);
    }
  };

  const fetchAttendance = async (instituteId: number) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/attendances/${instituteId}?startDate=${firstDayOfMonth}&endDate=${lastDayOfMonth}`
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
    <Paper elevation={3} className="calendar-container">
      <div
        className="flex"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h5" className="calendar-title">
          Student Attendance
        </Typography>

        <FormControl sx={{ width: 200, marginTop: "-5px" }} size="small">
          <InputLabel
            sx={{
              color: "rgba(0, 0, 0, 0.7)",
              fontWeight: "bold",
              paddingBottom: "5px",
              fontSize: "1.4rem",
            }}
          >
            Select Institute
          </InputLabel>
          <Select
            value={selectedInstituteId || ""}
            onChange={handleInstituteChange}
            sx={{ marginTop: "13px" }}
          >
            {institutes.map((institute) => (
              <MenuItem key={institute.id} value={institute.id}>
                {institute.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        height="auto"
        dateClick={handleDateClick}
        eventContent={(arg) => {
          const eventText = arg.event.title.split("\n");

          return (
            <div style={{ textAlign: "center", fontSize: "13px" }}>
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

<Dialog
  open={openDialog}
  onClose={handleCloseDialog}
  fullWidth
  maxWidth="sm"
  sx={{
    "& .MuiPaper-root": {
      borderRadius: "12px",
      padding: "10px",
      boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
    },
  }}
>
  <DialogTitle
    sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: "#f5f5f5",
      padding: "12px 20px",
      fontWeight: "bold",
      fontSize: "1.2rem",
    }}
  >
    <Typography variant="h6" sx={{ fontWeight: "bold", color: "#333" }}>
      {selectedDate &&
        new Date(selectedDate).toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
    </Typography>
    <IconButton onClick={handleCloseDialog} sx={{ color: "#555" }}>
      <CloseIcon />
    </IconButton>
  </DialogTitle>

  <DialogContent dividers sx={{ padding: "20px" }}>
    <Box
      className="attendance-summary"
      sx={{
        display: "flex",
        gap: "10px",
        flexWrap: "wrap",
        justifyContent: "center",
        marginBottom: "15px",
      }}
    >
    </Box>

    <List sx={{ maxHeight: "300px", overflowY: "auto" }}>
      {studentsOnSelectedDate.map((student) => (
        <ListItem key={student.id} divider sx={{ padding: "10px 15px" }}>
          <ListItemText
            primary={student.studentName}
            sx={{ fontWeight: "500", fontSize: "1rem" }}
          />
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

  <DialogActions sx={{ padding: "12px 20px", justifyContent: "center" }}>
    
  </DialogActions>
</Dialog>

    </Paper>
  );
}
