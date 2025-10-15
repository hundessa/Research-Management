import { useEffect, useState } from "react";
import FinanceSideNavBar from "./FinanceSideNavBar";
import Header from "../../../components/Header_Nav_Bar/Header";


type Notification = {
  _id: string;
  message: string;
  recipientRole: string;
  timestamp: string;
};


const FinanceNotification: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch(
          "http://localhost:4001/finance-notifications"
        );

        const data = await res.json();
        setNotifications(data);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
        setError("Failed to load notifications. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  if (loading) return <p>Loading notifications...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <>
      <Header />
      <section className="flex min-h-screen bg-gray-100">
        <FinanceSideNavBar />
        <div className="p-6 xl:ml-[25%] mt-[5%]">
          <h3 className="text-xl font-bold mb-4">Notifications</h3>
          {notifications.length === 0 ? (
            <p>No notifications found.</p>
          ) : (
            <ul className="space-y-4">
              {notifications.map((notif) => (
                <li key={notif._id} className="border-b pb-2">
                  <p>{notif.message}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(notif.timestamp).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
};

export default FinanceNotification;