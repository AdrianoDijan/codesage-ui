import "./App.css";

import { Routes, Route } from "react-router";

import Login from "./pages/login";
import Logout from "./pages/logout";
import { ProtectedRoute } from "./lib/auth";
import MainLayout from "./layouts/SidebarLayout";
import AccountPage from "./pages/account";
import LoginPage from "./pages/login";
import HomePage from "./pages/homepage";
import ProjectPage from "./pages/project";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<HomePage />} />
        <Route path="/projects/:projectId" element={<ProjectPage />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/account" element={<AccountPage />} />
      </Route>
    </Routes>
  );
}

export default App;
