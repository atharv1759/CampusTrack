import React from "react";
import notificationImage from "../../../assets/notification/notification.png";

function NotificationPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full pt-10">
      <img
        src={notificationImage}
        alt="Notification"
        className="w-80 h-80 object-contain"
      />
    </div>
  );
}

export default NotificationPage;
