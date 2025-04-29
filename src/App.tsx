import "./App.css";

import { Routes, Route } from "react-router";

import Login from "./pages/login";
import Logout from "./pages/logout";
import { ProtectedRoute } from "./lib/auth";
import TestPage from "./pages/test";
import MainLayout from "./layouts/SidebarLayout";
import Account from "./pages/account";

function App() {
  return (
    <Routes>
      {/* Routes without sidebar */}
      <Route path="/login" element={<Login />} />

      {/* Protected routes with sidebar */}
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<TestPage />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/account" element={<Account />} />
      </Route>
    </Routes>
  );
}

export default App;
