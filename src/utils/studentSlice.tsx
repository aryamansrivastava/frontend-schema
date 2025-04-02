import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Student {
    id: string;
    name: string;
    marks: number;
  }
  
  interface StudentState {
    available: Student[];
    dropped: Student[];
  }

  const initialState: StudentState = {
    available: [
      { id: "1", name: "Alice Johnson", marks: 85 },
      { id: "2", name: "Bob Smith", marks: 78 },
      { id: "3", name: "Charlie Brown", marks: 92 },
    ],
    dropped: [],
  };

  const studentSlice = createSlice({
    name: "students",
    initialState,
    reducers: {
      moveToDropped: (state, action: PayloadAction<string>) => {
        const student = state.available.find((s) => s.id === action.payload);
        if (student) {
          state.available = state.available.filter((s) => s.id !== student.id);
          state.dropped.push(student);
        }
      },
      moveToAvailable: (state, action: PayloadAction<string>) => {
        const student = state.dropped.find((s) => s.id === action.payload);
        if (student) {
          state.dropped = state.dropped.filter((s) => s.id !== student.id);
          state.available.push(student);
        }
      },
      reorderStudents: (
        state,
        action: PayloadAction<{ listType: "available" | "dropped"; dragIndex: number; hoverIndex: number }>
      ) => {
        const list = state[action.payload.listType];
        if (list) {
          const [movedStudent] = list.splice(action.payload.dragIndex, 1);
          list.splice(action.payload.hoverIndex, 0, movedStudent);
        }
      },
    },
  });
  
  export const { moveToDropped, moveToAvailable, reorderStudents } = studentSlice.actions;
  export default studentSlice.reducer;