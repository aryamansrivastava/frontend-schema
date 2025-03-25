import { useState, useEffect } from "react";
import axios from "axios";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction"; 
import "./CalendarStyle.css"

interface Attendance {
  id: number;
  studentName: string;
  status: "Present" | "Absent";
  date: string;
}

export default function StudentAttendanceCalendar() {
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0]); 
  const [events, setEvents] = useState<{ title: string; date: string; color: string }[]>([]);

  const fetchAttendance = async (date: string) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/attendances?startDate=${date}&endDate=${date}`);
      setAttendance(response.data);

      const mappedEvents = response.data.map((record: Attendance) => ({
        title: `${record.studentName} (${record.status})`,
        date: record.date,
        color: record.status === "Present" ? "#0d6efd" : "#dc3545",
        className: record.status === "Present" ? "event-present" : "event-absent",
      }));

      setEvents(mappedEvents);
    } catch (error) {
      console.error("Error fetching attendance:", error);
    }
  };

  useEffect(() => {
    fetchAttendance(selectedDate);
  }, [selectedDate]);

  const handleDateClick = (info: any) => {
    setSelectedDate(info.dateStr); 
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Student Attendance</h2>

      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        dateClick={handleDateClick} 
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,dayGridWeek,dayGridDay",
        }}
        height="auto"
        eventContent={(eventInfo) => (
          <div className={`custom-event ${eventInfo.event.classNames.join(" ")}`}>
            {eventInfo.event.title}
          </div>
        )}
      />
    </div>
  );
}