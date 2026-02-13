import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaFileAlt, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import DeanSideNavBar from "./Navigations/DeanSideNavBar";
import Header from "../../../components/Header_Nav_Bar/Header";

interface Research {
  _id: string;
  researchTitle: string;
  researchType: string;
  status: string;
  createdAt: string;
  researcher: { id: string; firstname: string; lastname: string };
}

const DeanDashboard: React.FC = () => {
  const [researches, setResearches] = useState<Research[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const researchRes = await axios.get("http://localhost:4001/dean/researches-list", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        console.log("Research API response:", researchRes.data); // Debug log
        if (Array.isArray(researchRes.data.data)) {
          setResearches(researchRes.data.data);
        } else {
          console.warn("Researches data is not an array, defaulting to empty array");
          setResearches([]);
        }
      } catch (err: unknown) {
        console.error("Error fetching dashboard data:", err);
        setError(
          typeof err === "object" && err !== null && "message" in err
            ? (err as { message?: string }).message || "Failed to load data"
            : "Failed to load data"
        );
        setResearches([]); // Ensure researches is an array even on error
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle accept/reject research
  const handleResearchAction = async (researchId: string, action: "accept" | "reject") => {
    try {
      await axios.patch(
        `http://localhost:4001/api/dean/researches-list/${researchId}/${action}`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setResearches((prev) =>
        prev.map((r) =>
          r._id === researchId ? { ...r, status: action === "accept" ? "accepted" : "rejected" } : r
        )
      );
    } catch (err: unknown) {
      console.error(`Error ${action}ing research:`, err);
      // alert(`Failed to ${action} research: ${err.message || "Unknown error"}`);
      alert(
        `Failed to ${action}: ${
          typeof err === "object" && err !== null && "message" in err
            ? (err as { message?: string }).message
            : "Unknown error"
        }`
      );
    }
  };

  // Summary metrics
  const metrics = {
    totalForwarded: researches.length,
    pendingReviews: researches.filter((r) => r.status === "forwarded").length,
  };

  if (loading)
    return (
      <div className="flex min-h-screen bg-gray-100">
        <DeanSideNavBar />
        <div className="ml-[25%] mt-[10%] w-full max-w-7xl p-6">
          <div className="bg-gray-300 h-20 rounded-xl mb-6 animate-pulse"></div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="bg-gray-300 h-24 rounded-xl animate-pulse"></div>
            ))}
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="h-6 bg-gray-300 rounded w-1/4 mb-4 animate-pulse"></div>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-300 rounded mb-2 animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex min-h-screen bg-gray-100">
        <DeanSideNavBar />
        <div className="ml-[25%] mt-[10%] text-red-600">
          Error: {error}
          <button
            className="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );

  return (
    <>
      <Header />
      <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
        <DeanSideNavBar />
        <div className="ml-[25%] mt-[5%] p-6 w-full max-w-7xl">
          {/* Welcome Message */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-xl shadow-lg mb-6">
            <h1 className="text-3xl font-bold">Welcome, {user.firstname} {user.lastname}!</h1>
            <p className="mt-2">Review and manage forwarded research submissions.</p>
          </div>

          {/* Summary Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white p-4 rounded-xl shadow-md border-l-4 border-purple-500">
              <h3 className="text-lg font-semibold text-gray-800">Forwarded Researches</h3>
              <p className="text-2xl font-bold text-purple-600">{metrics.totalForwarded}</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-md border-l-4 border-yellow-500">
              <h3 className="text-lg font-semibold text-gray-800">Pending Reviews</h3>
              <p className="text-2xl font-bold text-yellow-600">{metrics.pendingReviews}</p>
            </div>
          </div>

          {/* Research Review */}
          <div className="bg-white p-6 rounded-xl shadow-md mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaFileAlt className="mr-2" /> Research Review
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-3">Title</th>
                    <th className="p-3">Researcher</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Submitted On</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {researches.length > 0 ? (
                    researches.map((item) => (
                      <tr key={item._id} className="border-b hover:bg-gray-50">
                        <td className="p-3">{item.researchTitle.substring(0, 30)}...</td>
                        <td className="p-3">{item.researcher.firstname} {item.researcher.lastname}</td>
                        <td className="p-3">{item.researchType}</td>
                        <td className="p-3">{new Date(item.createdAt).toLocaleDateString()}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-1 rounded text-white text-xs ${
                              item.status === "accepted"
                                ? "bg-green-600"
                                : item.status === "rejected"
                                ? "bg-red-600"
                                : "bg-yellow-500"
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="p-3 flex gap-2">
                          <button
                            className="text-blue-600 hover:underline"
                            onClick={() => navigate(`/dean/researches/${item._id}`)}
                          >
                            View
                          </button>
                          {item.status === "forwarded" && (
                            <>
                              <button
                                className="flex items-center text-green-600 hover:text-green-800"
                                onClick={() => handleResearchAction(item._id, "accept")}
                              >
                                <FaCheckCircle className="mr-1" /> Accept
                              </button>
                              <button
                                className="flex items-center text-red-600 hover:text-red-800"
                                onClick={() => handleResearchAction(item._id, "reject")}
                              >
                                <FaTimesCircle className="mr-1" /> Reject
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-3 text-center text-gray-500">
                        No forwarded researches available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
            <div className="flex flex-wrap gap-4">
              <button
                className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                onClick={() => navigate("/dean/researches-list")}
              >
                <FaFileAlt className="mr-2" /> View All Researches
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeanDashboard;
