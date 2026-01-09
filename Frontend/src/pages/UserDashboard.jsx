import React from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "../components/user-dashboard/Sidebar";
import MyLostItems from "../components/user-dashboard/Lost-Item/MyLostItems";
import MyFoundItems from "../components/user-dashboard/Found-Item/MyFoundItems";
import ProfileSection from "../components/user-dashboard/ProfileSection";
import NotificationPage from "../components/user-dashboard/Notification/NotificationPage";
import MyMatches from "../components/user-dashboard/Matches/MyMatches";

function UserDashboard() {
  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 relative min-h-screen md:ml-64">
        {/* Background */}
        <div className="fixed inset-0 bg-gradient-to-b from-slate-900 via-gray-900 to-black -z-10"></div>
        <div className="fixed inset-0 opacity-30 -z-10">
          <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-orange-500/20 to-transparent"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 p-5">
        <Routes>
          <Route
            path="/"
            element={
              <div className="p-5">
                <ProfileSection />
              </div>
            }
          />

          <Route path="/my-lost-items" element={<MyLostItems />} />
          <Route path="/my-found-items" element={<MyFoundItems />} />
          <Route path="/my-matches" element={<MyMatches />} />
          <Route path="/notification" element={<NotificationPage />} />
        </Routes>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
