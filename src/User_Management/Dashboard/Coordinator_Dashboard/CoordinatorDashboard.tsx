import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUsers, FaFileAlt, FaCalendarAlt, FaCheckCircle, FaTimesCircle, FaUserPlus } from "react-icons/fa";
import CoordinatorSideNavBar from "./Navigation/CoordinatorSideNavBar";
import Header from "../../../components/Header_Nav_Bar/Header";

interface Reviewer {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  assignedResearches: number;
}

interface Research {
  _id: string;
  researchTitle: string;
  researchType: string;
  status: string;
  createdAt: string;
  defenseDate?: string | null;
  averagePostDefenseScore?: number | null;
  researcher: { id: string; firstname: string; lastname: string };
  reviewers: Array<{ id: string; firstname: string; lastname: string }>;
}

const CoordinatorDashboard: React.FC = () => {
  const [reviewers, setReviewers] = useState<Reviewer[]>([]);
  const [researches, setResearches] = useState<Research[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch reviewers
        const reviewersRes = await axios.get(
          "http://localhost:4001/coordinator-users-list",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (Array.isArray(reviewersRes.data.data)) {
          setReviewers(reviewersRes.data.data);
        } else {
          console.warn("Reviewers data is not an array, defaulting to empty array");
          setReviewers([]);
        }

        // Fetch researches
        const researchesRes = await axios.get("http://localhost:4001/coordinator-researches-list", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (Array.isArray(researchesRes.data.data)) {
          setResearches(researchesRes.data.data);
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
        setReviewers([]);
        setResearches([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Assign reviewers
  const handleAssignReviewers = async (researchId: string, reviewerIds: string[]) => {
    try {
      await axios.patch(
        `http://localhost:4001/coordinator-researches-list/${researchId}/assign-reviewers`,
        { reviewerIds },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setResearches((prev) =>
        prev.map((r) =>
          r._id === researchId
            ? {
                ...r,
                reviewers: reviewerIds.map((id) => {
                  const reviewer = reviewers.find((rev) => rev._id === id);
                  return { id, firstname: reviewer?.firstname || "Unknown", lastname: reviewer?.lastname || "" };
                }),
              }
            : r
        )
      );
      alert("Reviewers assigned successfully");
    } catch (err: unknown) {
      console.error("Error assigning reviewers:", err);
      alert(
        `Failed to assign reviewers: ${
          typeof err === "object" && err !== null && "message" in err
            ? (err as { message?: string }).message
            : "Unknown error"
        }`
      );
    }
  };

  // Assign defense date
  const handleAssignDefenseDate = async (researchId: string, defenseDate: string) => {
    try {
      await axios.patch(
        `http://localhost:4001/coordinator/researches/${researchId}/defense-date`,
        { defenseDate },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setResearches((prev) =>
        prev.map((r) => (r._id === researchId ? { ...r, defenseDate } : r))
      );
      alert("Defense date assigned successfully");
    } catch (err: unknown) {
      console.error("Error assigning defense date:", err);
      alert(
        `Failed to assign defense date: ${
          typeof err === "object" && err !== null && "message" in err
            ? (err as { message?: string }).message || "Unknown error"
            : "Unknown error"
        }`
      );
    }
  };

  // Accept or reject research
  const handleResearchAction = async (researchId: string, action: "accept" | "reject") => {
    try {
      await axios.patch(
        `http://localhost:4001/coordinator/researches/${researchId}/${action}`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setResearches((prev) =>
        prev.map((r) =>
          r._id === researchId ? { ...r, status: action === "accept" ? "accepted" : "rejected" } : r
        )
      );
      alert(`Research ${action}ed successfully`);
    } catch (err: unknown) {
      console.error(`Error ${action}ing research:`, err);
      alert(
        `Failed to ${action} research: ${
          typeof err === "object" && err !== null && "message" in err
            ? (err as { message?: string }).message || "Unknown error"
            : "Unknown error"
        }`
      );
    }
  };

  // Summary metrics
  const metrics = {
    totalReviewers: reviewers.length,
    totalResearches: researches.length,
    pendingReviews: researches.filter((r) => r.reviewers.length === 0).length,
    pendingDefense: researches.filter((r) => !r.defenseDate && r.status === "reviewed").length,
  };

  if (loading)
    return (
      <div className="flex min-h-screen bg-gray-100">
        <CoordinatorSideNavBar />
        <div className="ml-[25%] mt-[10%] w-full max-w-7xl p-6">
          <div className="bg-gray-300 h-20 rounded-xl mb-6 animate-pulse"></div>
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-300 h-24 rounded-xl animate-pulse"></div>
            ))}
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md mb-6">
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
        <CoordinatorSideNavBar />
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
        <CoordinatorSideNavBar />
        <div className="ml-[25%] mt-[5%] p-6 w-full max-w-7xl">
          {/* Welcome Message */}
          <div className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white p-6 rounded-xl shadow-lg mb-6">
            <h1 className="text-3xl font-bold">Welcome, {user.firstname} {user.lastname}!</h1>
            <p className="mt-2">Manage reviewers, researches, and defense evaluations.</p>
          </div>

          {/* Summary Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-xl shadow-md border-l-4 border-teal-500">
              <h3 className="text-lg font-semibold text-gray-800">Total Reviewers</h3>
              <p className="text-2xl font-bold text-teal-600">{metrics.totalReviewers}</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-md border-l-4 border-cyan-500">
              <h3 className="text-lg font-semibold text-gray-800">Total Researches</h3>
              <p className="text-2xl font-bold text-cyan-600">{metrics.totalResearches}</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-md border-l-4 border-yellow-500">
              <h3 className="text-lg font-semibold text-gray-800">Pending Reviews</h3>
              <p className="text-2xl font-bold text-yellow-600">{metrics.pendingReviews}</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-md border-l-4 border-orange-500">
              <h3 className="text-lg font-semibold text-gray-800">Pending Defense Dates</h3>
              <p className="text-2xl font-bold text-orange-600">{metrics.pendingDefense}</p>
            </div>
          </div>

          {/* Reviewer List */}
          <div className="bg-white p-6 rounded-xl shadow-md mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaUsers className="mr-2" /> Reviewers
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-3">Name</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Assigned Researches</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reviewers.length > 0 ? (
                    reviewers.map((item) => (
                      <tr key={item._id} className="border-b hover:bg-gray-50">
                        <td className="p-3">{item.firstname} {item.lastname}</td>
                        <td className="p-3">{item.email}</td>
                        <td className="p-3">{item.assignedResearches}</td>
                        <td className="p-3">
                          <button
                            className="text-blue-600 hover:underline"
                            onClick={() => navigate(`/coordinator/reviewers/${item._id}`)}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="p-3 text-center text-gray-500">
                        No reviewers available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Research List */}
          <div className="bg-white p-6 rounded-xl shadow-md mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaFileAlt className="mr-2" /> Researches
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-3">Title</th>
                    <th className="p-3">Researcher</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Defense Date</th>
                    <th className="p-3">Avg Score</th>
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
                        <td className="p-3">
                          <span
                            className={`px-2 py-1 rounded text-white text-xs ${
                              item.status === "accepted"
                                ? "bg-green-600"
                                : item.status === "rejected"
                                ? "bg-red-600"
                                : item.status === "reviewed"
                                ? "bg-yellow-500"
                                : item.status === "underDefense"
                                ? "bg-purple-500"
                                : "bg-blue-500"
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="p-3">
                          {item.defenseDate ? new Date(item.defenseDate).toLocaleDateString() : "Not Set"}
                        </td>
                        <td className="p-3">
                          {item.averagePostDefenseScore
                            ? item.averagePostDefenseScore.toFixed(1)
                            : "N/A"}
                        </td>
                        <td className="p-3 flex gap-2 flex-wrap">
                          <button
                            className="text-blue-600 hover:underline"
                            onClick={() => navigate(`/coordinator/researches/${item._id}`)}
                          >
                            View
                          </button>
                          {item.reviewers.length === 0 && (
                            <button
                              className="flex items-center text-teal-600 hover:text-teal-800"
                              onClick={() =>
                                handleAssignReviewers(
                                  item._id,
                                  reviewers.slice(0, 2).map((r) => r._id) // Example: Assign first 2 reviewers
                                )
                              }
                            >
                              <FaUserPlus className="mr-1" /> Assign Reviewers
                            </button>
                          )}
                          {!item.defenseDate && item.status === "reviewed" && (
                            <button
                              className="flex items-center text-orange-600 hover:text-orange-800"
                              onClick={() =>
                                handleAssignDefenseDate(
                                  item._id,
                                  new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // Example: 7 days from now
                                )
                              }
                            >
                              <FaCalendarAlt className="mr-1" /> Set Defense
                            </button>
                          )}
                          {item.status === "underDefense" && item.averagePostDefenseScore && (
                            <>
                              <button
                                className="flex items-center text-green-600 hover:text-green-800"
                                onClick={() => handleResearchAction(item._id, "accept")}
                                disabled={item.averagePostDefenseScore < 70} // Example threshold
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
                      <td colSpan={7} className="p-3 text-center text-gray-500">
                        No researches available
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
                className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
                onClick={() => navigate("/coordinator/reviewers")}
              >
                <FaUsers className="mr-2" /> View All Reviewers
              </button>
              <button
                className="flex items-center px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition"
                onClick={() => navigate("/coordinator/researches")}
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

export default CoordinatorDashboard;
