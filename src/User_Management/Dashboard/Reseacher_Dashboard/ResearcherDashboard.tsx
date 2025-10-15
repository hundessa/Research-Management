// import { useEffect, useState } from "react";
// import Header from "../../../components/Header_Nav_Bar/Header";
// import ResearcherSideNavBar from "./Navigations/ResearcherSideNavbar";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// interface ResearchItem {
//   _id: string;
//   researchTitle: string;
//   researchType: string;
//   status: string;
//   createdAt: string;
// }


// const ResearcherDashboard: React.FC = () => {

//     const [research, setResearch] = useState<ResearchItem[]>([]);
//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     const [financeRequests, setFinanceRequests] = useState([]);
//     const navigate = useNavigate();
//     const user = JSON.parse(localStorage.getItem("user") || "{}");
//     const researcherId = user?.id;

//     useEffect(() => {
//       const fetchData = async () => {
//         try {
//           // Fetch researches
//           const researchRes = await axios.get(
//             `http://localhost:4001/researcher/researches-list?researcherId=${researcherId}`
//           );
//           setResearch(researchRes.data.data.reverse());

//           // Fetch finance requests
//           const financeRes = await axios.get(
//             `http://localhost:4001/researcher/finance-requests?researcherId=${researcherId}`,
//             {
//               headers: {
//                 Authorization: `Bearer ${localStorage.getItem("token")}`,
//               },
//             }
//           );
//           setFinanceRequests(financeRes.data.data);
//         } catch (error) {
//           console.error("Error fetching dashboard data:", error);
//         }
//       };
//       fetchData();
//     }, [researcherId]);

//     const researchStatusCounts = {
//       total: research.length,
//       submitted: research.filter((r) => r.status === "submitted").length,
//       reviewed: research.filter((r) => r.status === "reviewed").length,
//       accepted: research.filter((r) => r.status === "accepted").length,
//       rejected: research.filter((r) => r.status === "rejected").length,
//     };


//     return (
//       <>
//         <Header />
//         <div className="flex min-h-screen bg-gray-100">
//           <ResearcherSideNavBar />
//           <div className="ml-[25%] mt-[5%] p-6 w-full max-w-4xl">
//             <h1 className="text-2xl font-bold mb-4">
//               Welcome, {user.firstname} {user.lastname}!
//             </h1>

//             {/* Research Summary */}
//             <div className="bg-white p-4 rounded-lg shadow-md mb-6">
//               <h2 className="text-xl font-semibold mb-2">Research Overview</h2>
//               <p>Total Researches: {researchStatusCounts.total}</p>
//               <p>Submitted: {researchStatusCounts.submitted}</p>
//               <p>Reviewed: {researchStatusCounts.reviewed}</p>
//               <p>Accepted: {researchStatusCounts.accepted}</p>
//               <p>Rejected: {researchStatusCounts.rejected}</p>
//             </div>

//             {/* Recent Researches */}
//             <div className="bg-white p-4 rounded-lg shadow-md mb-6">
//               <h2 className="text-xl font-semibold mb-2">Recent Researches</h2>
//               <table className="w-full text-left">
//                 <thead>
//                   <tr>
//                     <th>Title</th>
//                     <th>Type</th>
//                     <th>Status</th>
//                     <th>Submitted On</th>
//                     <th>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {research.slice(0, 5).map((item) => (
//                     <tr key={item._id}>
//                       <td>{item.researchTitle.substring(0, 30)}...</td>
//                       <td>{item.researchType}</td>
//                       <td>
//                         <span
//                           className={`px-2 py-1 rounded text-white ${
//                             item.status === "accepted"
//                               ? "bg-green-600"
//                               : item.status === "reviewed"
//                               ? "bg-yellow-400"
//                               : item.status === "submitted"
//                               ? "bg-blue-400"
//                               : "bg-red-400"
//                           }`}
//                         >
//                           {item.status}
//                         </span>
//                       </td>
//                       <td>{new Date(item.createdAt).toLocaleDateString()}</td>
//                       <td>
//                         <button
//                           className="text-blue-500 mr-2"
//                           onClick={() =>
//                             navigate(`/researcher/researches/${item._id}`)
//                           }
//                         >
//                           View
//                         </button>
//                         {item.status === "accepted" && (
//                           <button
//                             className="text-green-500"
//                             onClick={() =>
//                               navigate(`/researcher/finance-form/${item._id}`)
//                             }
//                           >
//                             Finance Request
//                           </button>
//                         )}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             {/* Quick Actions */}
//             <div className="bg-white p-4 rounded-lg shadow-md">
//               <h2 className="text-xl font-semibold mb-2">Quick Actions</h2>
//               <button
//                 className="px-4 py-2 bg-blue-600 text-white rounded mr-2"
//                 onClick={() => navigate("/researcher/research-upload")}
//               >
//                 Upload New Research
//               </button>
//               <button
//                 className="px-4 py-2 bg-blue-600 text-white rounded"
//                 onClick={() => navigate("/researcher/researches")}
//               >
//                 View All Researches
//               </button>
//             </div>
//           </div>
//         </div>
//       </>
//     );
// }

// export default ResearcherDashboard;



import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUpload, FaList, FaMoneyCheckAlt, FaBell } from "react-icons/fa";
import Header from "../../../components/Header_Nav_Bar/Header";
import ResearcherSideNavBar from "./Navigations/ResearcherSideNavbar";

interface ResearchItem {
  _id: string;
  researchTitle: string;
  researchType: string;
  status: string;
  createdAt: string;
  defenseDate?: string | null;
  averagePreDefenseScore?: number | null;
  averagePostDefenseScore?: number | null;
}

interface FinanceRequest {
  _id: string;
  researchId: { researchTitle: string };
  amount: number;
  purpose: string;
  status: string;
  submittedAt: string;
}

const ResearcherDashboard: React.FC = () => {
  const [research, setResearch] = useState<ResearchItem[]>([]);
  const [financeRequests, setFinanceRequests] = useState<FinanceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const researcherId = user?.id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch researches
        const researchRes = await axios.get(
          `http://localhost:4001/researcher/researches-list?researcherId=${researcherId}`,
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
        setResearch(researchRes.data.data.reverse());

        // Fetch finance requests
        const financeRes = await axios.get(
          `http://localhost:4001/researcher/finance-requests?researcherId=${researcherId}`,
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
        setFinanceRequests(financeRes.data.data);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    if (researcherId) fetchData();
  }, [researcherId]);

  // Research status counts
  const researchStatusCounts = {
    total: research.length,
    submitted: research.filter((r) => r.status === "submitted").length,
    reviewed: research.filter((r) => r.status === "reviewed").length,
    underDefense: research.filter((r) => r.status === "underDefense").length,
    accepted: research.filter((r) => r.status === "accepted").length,
    rejected: research.filter((r) => r.status === "rejected").length,
  };

  // Finance request status counts
  const financeStatusCounts = {
    total: financeRequests.length,
    pending: financeRequests.filter((r) => r.status === "pending").length,
    approved: financeRequests.filter((r) => r.status === "approved").length,
    rejected: financeRequests.filter((r) => r.status === "rejected").length,
  };

  // Calculate average evaluation score
  const avgScore =
    research.reduce((sum, r) => {
      const score = r.averagePostDefenseScore || r.averagePreDefenseScore || 0;
      return sum + score;
    }, 0) / (research.length || 1);

  // Get pending actions
  const pendingActions = research
    .filter((r) => r.status === "reviewed" || (r.defenseDate && new Date(r.defenseDate) > new Date()))
    .slice(0, 3);

  // Get status progress percentage
  const getProgress = (status: string) => {
    switch (status) {
      case "submitted": return 25;
      case "reviewed": return 50;
      case "underDefense": return 75;
      case "accepted": return 100;
      case "rejected": return 100;
      default: return 0;
    }
  };

  if (loading) return <div className="flex min-h-screen bg-gray-100"><ResearcherSideNavBar /><div className="ml-[25%] mt-[10%]">Loading...</div></div>;
  if (error) return <div className="flex min-h-screen bg-gray-100"><ResearcherSideNavBar /><div className="ml-[25%] mt-[10%] text-red-600">Error: {error}</div></div>;

  return (
    <>
      <Header />
      <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
        <ResearcherSideNavBar />
        <div className="ml-[25%] mt-[5%] p-6 w-full max-w-7xl">
          {/* Welcome Message */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-xl shadow-lg mb-6">
            <h1 className="text-3xl font-bold">
              Welcome, {user.firstname} {user.lastname}!
            </h1>
            <p className="mt-2">
              Explore your research progress and manage your projects.
            </p>
          </div>

          {/* Research Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded-xl shadow-md border-l-4 border-blue-500">
              <h3 className="text-lg font-semibold text-gray-800">
                Total Researches
              </h3>
              <p className="text-2xl font-bold text-blue-600">
                {researchStatusCounts.total}
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-md border-l-4 border-green-500">
              <h3 className="text-lg font-semibold text-gray-800">
                Accepted Researches
              </h3>
              <p className="text-2xl font-bold text-green-600">
                {researchStatusCounts.accepted}
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-md border-l-4 border-yellow-500">
              <h3 className="text-lg font-semibold text-gray-800">
                Average Score
              </h3>
              <p className="text-2xl font-bold text-yellow-600">
                {avgScore.toFixed(1)}/100
              </p>
            </div>
          </div>
          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-xl shadow-md mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Quick Actions
            </h2>
            <div className="flex flex-wrap gap-4">
              <button
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                onClick={() => navigate("/researcher/research-upload")}
              >
                <FaUpload className="mr-2" /> Upload New Research
              </button>
              <button
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                onClick={() => navigate("/researcher/researches")}
              >
                <FaList className="mr-2" /> View All Researches
              </button>
              {/* <button
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                onClick={() =>
                  navigate(
                    `/researcher/finance-form/${
                      research.find((r) => r.status === "accepted")?._id || ""
                    }`
                  )
                }
                disabled={!research.some((r) => r.status === "accepted")}
              >
                <FaMoneyCheckAlt className="mr-2" /> Submit Finance Request
              </button> */}
            </div>
          </div>
          {/* Recent Researches */}
          <div className="bg-white p-6 rounded-xl shadow-md mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaList className="mr-2" /> Recent Researches
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-3">Title</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Score</th>
                    <th className="p-3">Defense Date</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {research.slice(0, 5).map((item) => (
                    <tr key={item._id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        {item.researchTitle.substring(0, 30)}...
                      </td>
                      <td className="p-3">{item.researchType}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded text-white text-xs ${
                            item.status === "accepted"
                              ? "bg-green-600"
                              : item.status === "reviewed"
                              ? "bg-yellow-500"
                              : item.status === "submitted"
                              ? "bg-blue-500"
                              : item.status === "underDefense"
                              ? "bg-purple-500"
                              : "bg-red-500"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="p-3">
                        {(
                          item.averagePostDefenseScore ||
                          item.averagePreDefenseScore ||
                          "N/A"
                        )
                          .toString()
                          .substring(0, 4)}
                        /100
                      </td>
                      <td className="p-3">
                        {item.defenseDate
                          ? new Date(item.defenseDate).toLocaleDateString()
                          : "Not Set"}
                      </td>
                      <td className="p-3 flex gap-2">
                        <button
                          className="text-blue-600 hover:underline"
                          onClick={() =>
                            navigate(`/researcher/researches/${item._id}`)
                          }
                        >
                          View
                        </button>
                        {item.status === "accepted" && (
                          <button
                            className="text-green-600 hover:underline"
                            onClick={() =>
                              navigate(`/researcher/finance-form/${item._id}`)
                            }
                          >
                            Finance
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Finance Requests */}
          <div className="bg-white p-6 rounded-xl shadow-md mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaMoneyCheckAlt className="mr-2" /> Finance Requests
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-600">
                  Total Requests
                </h3>
                <p className="text-lg font-bold">{financeStatusCounts.total}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-600">
                  Approved
                </h3>
                <p className="text-lg font-bold text-green-600">
                  {financeStatusCounts.approved}
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-600">Pending</h3>
                <p className="text-lg font-bold text-yellow-600">
                  {financeStatusCounts.pending}
                </p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-3">Research Title</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Purpose</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Submitted On</th>
                  </tr>
                </thead>
                <tbody>
                  {financeRequests.slice(0, 3).map((item) => (
                    <tr key={item._id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        {item.researchId.researchTitle.substring(0, 30)}...
                      </td>
                      <td className="p-3">${item.amount.toFixed(2)}</td>
                      <td className="p-3">
                        {item.purpose.substring(0, 20)}...
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded text-white text-xs ${
                            item.status === "approved"
                              ? "bg-green-600"
                              : item.status === "pending"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="p-3">
                        {new Date(item.submittedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pending Actions */}
          <div className="bg-white p-6 rounded-xl shadow-md mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaBell className="mr-2" /> Pending Actions
            </h2>
            {pendingActions.length > 0 ? (
              <ul className="space-y-2">
                {pendingActions.map((item) => (
                  <li key={item._id} className="p-3 bg-gray-50 rounded-lg">
                    {item.status === "reviewed" ? (
                      <span>
                        Revise{" "}
                        <strong>
                          {item.researchTitle.substring(0, 30)}...
                        </strong>{" "}
                        (Feedback received)
                      </span>
                    ) : (
                      <span>
                        Prepare for defense of{" "}
                        <strong>
                          {item.researchTitle.substring(0, 30)}...
                        </strong>{" "}
                        on{" "}
                        {item.defenseDate &&
                          new Date(item.defenseDate).toLocaleDateString()}
                      </span>
                    )}
                    <button
                      className="ml-2 text-blue-600 hover:underline"
                      onClick={() =>
                        navigate(`/researcher/researches/${item._id}`)
                      }
                    >
                      View
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No pending actions.</p>
            )}
          </div>

          {/* Progress Timeline */}
          <div className="bg-white p-6 rounded-xl shadow-md mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Research Progress
            </h2>
            <div className="space-y-4">
              {research.slice(0, 3).map((item) => (
                <div key={item._id}>
                  <p className="text-sm font-semibold">
                    {item.researchTitle.substring(0, 40)}...
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className={`bg-blue-600 h-2.5 rounded-full transition-all duration-500`}
                      style={{ width: `${getProgress(item.status)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {item.status} ({getProgress(item.status)}%)
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResearcherDashboard;
