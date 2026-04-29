import { ThemeProvider } from "./config/context/ThemeContext";
import { AuthProvider } from "./config/context/AuthContext";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ThemeProvider>
  );
}