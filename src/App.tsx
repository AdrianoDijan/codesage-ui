import "./App.css";

import { Routes, Route } from "react-router";

import Login from "./pages/login";
import { ProtectedRoute } from "./lib/auth";
import MainLayout from "./layouts/sidebar";
import AccountPage from "./pages/account";
import HomePage from "./pages/homepage";
import ProjectPage from "./pages/project";
import ProjectSettingsPage from "./pages/project/settings";
import ProjectsPage from "./pages/projects";
import IntegrationsPage from "./pages/integrations";

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
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:projectId" element={<ProjectPage />} />
        <Route
          path="/projects/:projectId/settings"
          element={<ProjectSettingsPage />}
        />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/integrations" element={<IntegrationsPage />} />
      </Route>
    </Routes>
  );
}

export default App;
