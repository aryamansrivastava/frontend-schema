import { BrowserRouter as Router } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import AppRouter from "./Router";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Provider } from "react-redux";
import { store } from "./utils/store";

export default function App() {
  const theme = createTheme({
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            boxShadow: "none",
            outline: "1px solid #e5dfdd",
          },
        },
      },
    },
  });

  return (
    <Provider store={store}>
    <ThemeProvider theme={theme}>
      <Router>
        <div className="flex min-h-screen bg-gray-100 overflow-hidden">
          <Sidebar />
          <main className="flex-1 p-6 bg-gray-100 h-screen overflow-hidden">
            <AppRouter />
          </main>
        </div>
      </Router>
    </ThemeProvider>
    </Provider>
  );
}
