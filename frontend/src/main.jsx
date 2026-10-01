import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./routes/AppRouter";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { MotionConfig } from "framer-motion";
import AppErrorBoundary from "./components/AppErrorBoundary";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppErrorBoundary>
        <AuthProvider>
          <ThemeProvider>
            <MotionConfig reducedMotion="user">
              <App />
            </MotionConfig>
          </ThemeProvider>
        </AuthProvider>
      </AppErrorBoundary>
    </BrowserRouter>
  </React.StrictMode>
);
