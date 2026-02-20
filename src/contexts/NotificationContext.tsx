import { createContext, useState, useEffect, useContext } from "react";
import io from "socket.io-client";
import API from "../api/axios";

// Create socket connection to the backend
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4001";
// const socket = io("https://research-management.onrender.com"); // adjust your backend URL
const socket = io(API_URL);

interface BackendNotification {
  _id: string;
  message: string;
  timestamp: string;
}

type NotificationContextType = {
  notifications: Notification[];
};

const NotificationContext = createContext<NotificationContextType | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within NotificationProvider");
  }
  return context;
};

type Notification = {
  id: string;
  title: string;
  content: string;
  timestamp: Date;
};
export const NotificationProvider = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // 1. Fetch stored notifications from backend
    const fetchNotifications = async () => {
      try {
        // const res = await fetch("https://research-management.onrender.com/admin/notification"); // your route
        const res = await API.get<BackendNotification[]>("/admin/notification"); // your route
        // const data = await res.json();
        // type BackendNotification = {
        //   _id: string;
        //   message: string;
        //   timestamp: string;
        // };
        const formatted = res.data.map((n) => ({
          id: n._id,
          title: "New Research Uploaded",
          content: n.message,
          timestamp: new Date(n.timestamp),
        }));
        setNotifications(formatted);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };

    fetchNotifications();

    // 2. Listen for real-time notifications via socket
    // socket.on("new-research-uploaded", (notification) => {
    //   setNotifications((prevNotifications) => [
    //     notification,
    //     ...prevNotifications, // prepend new notifications
    //   ]);
    // });
//     socket.on(
//   "new-research-uploaded",
//   (notification: Notification) => {
//     setNotifications((prev) => [
//       notification,
//       ...prev,
//     ]);
//   }
// );
socket.on("new-research-uploaded", (n: BackendNotification) => {
  const formatted: Notification = {
    id: n._id,
    title: "New Research Uploaded",
    content: n.message,
    timestamp: new Date(n.timestamp),
  };
  setNotifications((prev) => [formatted, ...prev]);
});


    return () => {
      socket.off("new-research-uploaded");
    };
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

