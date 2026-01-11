import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../../../config";
import { FaBell, FaEnvelope, FaCheckCircle, FaClock } from "react-icons/fa";

function NotificationPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, unread

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(response.data || []);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_BASE_URL}/notifications/${notificationId}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_BASE_URL}/notifications/read-all`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, isRead: true }))
      );
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const filteredNotifications =
    filter === "unread"
      ? notifications.filter((n) => !n.isRead)
      : notifications;

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now - time;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const getNotificationIcon = (type) => {
    if (type === "new_message") {
      return <FaEnvelope className="text-blue-500 text-2xl" />;
    }
    return <FaBell className="text-green-500 text-2xl" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="h-full w-full text-white p-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <FaBell className="text-orange-500" />
            Notifications
          </h1>
          {unreadCount > 0 && (
            <p className="text-gray-400 mt-1">
              You have {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded-lg transition"
          >
            <FaCheckCircle />
            Mark All as Read
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setFilter("all")}
          className={`px-6 py-2 rounded-lg font-semibold transition ${
            filter === "all"
              ? "bg-orange-600 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilter("unread")}
          className={`px-6 py-2 rounded-lg font-semibold transition ${
            filter === "unread"
              ? "bg-orange-600 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <FaBell className="text-gray-600 text-6xl mb-4" />
          <p className="text-gray-400 text-lg">
            {filter === "unread"
              ? "No unread notifications"
              : "No notifications yet"}
          </p>
          <p className="text-gray-500 text-sm mt-2">
            You'll be notified when matches are found or messages are received
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => !notification.isRead && markAsRead(notification.id)}
              className={`p-5 rounded-lg border transition cursor-pointer ${
                notification.isRead
                  ? "bg-gray-800 border-gray-700"
                  : "bg-gray-700 border-orange-500 shadow-lg shadow-orange-500/20"
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="mt-1">
                  {getNotificationIcon(notification.data?.type)}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <h3 className="font-bold text-lg">{notification.title}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-400 flex items-center gap-1">
                        <FaClock className="text-xs" />
                        {getTimeAgo(notification.createdAt)}
                      </span>
                      {!notification.isRead && (
                        <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                      )}
                    </div>
                  </div>

                  <p className="text-gray-300 mt-2">{notification.message}</p>

                  {/* Additional Info */}
                  {notification.data?.confidence && (
                    <div className="mt-3 inline-block bg-green-900 text-green-300 px-3 py-1 rounded-full text-sm font-semibold">
                      {notification.data.confidence}% Match
                    </div>
                  )}

                  {notification.data?.matchId && notification.data?.type === "new_message" && (
                    <Link
                      to={`/user-dashboard/my-matches?chat=${notification.data.matchId}`}
                      className="inline-block mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Go to Chat →
                    </Link>
                  )}

                  {notification.data?.matchId && notification.data?.type === "match_found" && (
                    <Link
                      to="/user-dashboard/my-matches"
                      className="inline-block mt-3 text-orange-400 hover:text-orange-300 font-semibold text-sm underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View Match Details →
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default NotificationPage;
