import { useEffect, useState } from "react";
import Header from "../../../../components/Header_Nav_Bar/Header";
import DeanSideNavBar from "../Navigations/DeanSideNavBar";
import API from "../../../../api/axios";


type Notification = {
  _id: string;
  message: string;
  recipientRole: string;
  timestamp: string;
};


const DeanNotification: React.FC = () => {

    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchNotifications = async () => {
        try {
          const res = await API.get("/dean/notifications");
          const data = res.data;
          setNotifications(data);
        } catch (error) {
          console.error("Failed to fetch notifications:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchNotifications();
    }, []);

    if (loading) return <p>Loading notifications...</p>;


    return (
        <>
            <Header />
            <section className="flex min-h-screen bg-gray-100">
<DeanSideNavBar />
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
}

export default DeanNotification;