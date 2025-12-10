import React from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "../components/admin-dashboard/Sidebar";
import TopSection from "../components/admin-dashboard/TopSection";
import LostItemsPage from "../components/admin-dashboard/Lost-Item/LostItemPage";
import FoundItemsPage from "../components/admin-dashboard/Found-Item/FoundItemsPage";
import StudentsPage from "../components/admin-dashboard/Student/StudentPage";
import StaffPage from "../components/admin-dashboard/Staff/StaffPage";
import StudentProfile from "../components/admin-dashboard/Student/StudentProfile";
import StaffProfile from "../components/admin-dashboard/Staff/StaffProfile";
import MatchItemPage from "../components/admin-dashboard/Match-Items/MatchItemPage";
import MatchPage from "./MatchPage";


function AdminDashboard() {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Right content */}
      <div className="flex-1 bg-black min-h-screen md:ml-64">
        <Routes>
          <Route path="/" element={<TopSection />} />
          <Route path="lost-items" element={<LostItemsPage />} />
          <Route path="found-items" element={<FoundItemsPage />} />
          <Route path="students" element={<StudentsPage />} />
          <Route path="staff" element={<StaffPage />} />
          <Route path="match" element={<MatchItemPage />} />
          <Route path="matchAI" element={<MatchPage />} />
          <Route path="student-profile/:id" element={<StudentProfile />} />
          <Route path="staff-profile/:id" element={<StaffProfile />} />


        </Routes>
      </div>
    </div>
  );
}

export default AdminDashboard;
