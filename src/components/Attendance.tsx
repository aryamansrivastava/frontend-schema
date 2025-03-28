import { useState, useEffect } from "react";
import axios from "axios";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Dialog,DialogTitle,DialogContent,DialogActions,Button,Paper,Typography,List,ListItem,ListItemText,Avatar,Chip,Box,IconButton,
} from "@mui/material";
import {
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Groups as GroupsIcon,
  HowToReg as PresentIcon,
  PersonOff as AbsentIcon,
} from "@mui/icons-material";
import "./CalendarStyle.css";

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
    { title: string; date: string; color: string; extendedProps: { presentCount: number } }[]
  >([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [studentsOnSelectedDate, setStudentsOnSelectedDate] = useState<Attendance[]>([]);

  const currentDate = new Date();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    .toISOString()
    .split("T")[0];
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
    .toISOString()
    .split("T")[0];

  const fetchAttendance = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/attendances/${instituteId}?startDate=${firstDayOfMonth}&endDate=${lastDayOfMonth}`
      );

      const mappedAttendance: Attendance[] = response.data.studentAttendance.map((record: any) => ({
        id: record.id,
        studentName: record.student?.name || `Student ID: ${record.student_id}`,
        status: record.status === 1 ? "Present" : "Absent",
        date: record.date.split("T")[0],
      }));

      setAttendance(mappedAttendance);

      const attendanceByDate: Record<string, { present: number; students: Attendance[] }> = {};

      mappedAttendance.forEach((record) => {
        if (!attendanceByDate[record.date]) {
          attendanceByDate[record.date] = { present: 0, students: [] };
        }

        attendanceByDate[record.date].students.push(record);

        if (record.status === "Present") {
          attendanceByDate[record.date].present += 1;
        }
      });

      const mappedEvents = Object.keys(attendanceByDate).map((date) => ({
        title: `${attendanceByDate[date].present} Students Present`,
        date: date,
        color: getColorByAttendance(attendanceByDate[date].present),
        extendedProps: {
          presentCount: attendanceByDate[date].present,
        },
      }));

      setEvents(mappedEvents);
    } catch (error) {
      console.error("Error fetching attendance:", error);
    }
  };

  const getColorByAttendance = (count: number) => (count >= 5 ? "#8bc34a" : "#f44336");

  useEffect(() => {
    if (instituteId) {
      fetchAttendance();
    }
  }, [instituteId]);

  const handleDateClick = (info: any) => {
    const clickedDate = info.dateStr;
    setSelectedDate(clickedDate);

    const studentsForDate = attendance.filter((record) => record.date === clickedDate);
    setStudentsOnSelectedDate(studentsForDate);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <Paper elevation={3} className="calendar-container">
      <Typography variant="h5" className="calendar-title">
        Student Attendance
      </Typography>

      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        height="auto"
        dateClick={handleDateClick}
      />

      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle className="dialog-title">
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
        <DialogContent dividers>
          <Box className="attendance-summary">
            <Chip icon={<GroupsIcon />} label={`Total: ${studentsOnSelectedDate.length}`} />
            <Chip icon={<PresentIcon />} label={`Present: ${studentsOnSelectedDate.filter((s) => s.status === "Present").length}`} color="success" />
            <Chip icon={<AbsentIcon />} label={`Absent: ${studentsOnSelectedDate.filter((s) => s.status === "Absent").length}`} color="error" />
          </Box>

          <List>
            {studentsOnSelectedDate.map((student) => (
              <ListItem key={student.id} divider>
                <Avatar>{student.studentName[0]}</Avatar>
                <ListItemText primary={student.studentName} />
                <Chip
                  icon={student.status === "Present" ? <CheckCircleIcon /> : <CancelIcon />}
                  label={student.status}
                  color={student.status === "Present" ? "success" : "error"}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} className="custom-button">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}