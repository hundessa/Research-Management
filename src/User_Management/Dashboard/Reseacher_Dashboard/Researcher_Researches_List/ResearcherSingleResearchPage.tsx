// import axios from "axios";
// import { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import Header from "../../../../components/Header_Nav_Bar/Header";
// import ResearcherSideNavBar from "../Navigations/ResearcherSideNavbar";

// interface Researcher {
//   id: { firstname: string; lastname: string; email: string };
// }

// interface ResearchItem {
//   _id: string;
//   researchTitle: string;
//   researchType: string;
//   researchFile: string;
//   status: string;
//   researcher: Researcher;
//   createdAt: string;
// }

// const ResearcherSingleResearchPage: React.FC = () => {
//   const { id } = useParams<{ id: string }>();
//   const [research, setResearch] = useState<ResearchItem | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     (async () => {
//       try {
//         setLoading(true);
//         const res = await axios.get(
//           `http://localhost:4001/researcher/researches-list/${id}`,
//           {
//             withCredentials: true,
//           }
//         );
//         console.log("Fetched research:", res.data);
//         setResearch(res.data.data); // Access the 'data' field from the response
//       } catch (error: any) {
//         console.error("Error fetching research detail:", error);
//         setError(
//           error.response?.data?.message || "Failed to load research details"
//         );
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [id]);

//   const handleFinanceRequest = () => {
//     navigate(`/researcher/finance-form`, {
//       state: { researchId: research?._id },
//     });
//   };

//   const handleNavigateToReport = () => {
//     navigate(`/researcher/research/${researchId}/progress-report`);
//   };

//   if (loading) {
//     return (
//       <div className="flex min-h-screen bg-gray-100">
//         <ResearcherSideNavBar />
//         <div className="ml-[25%] mt-[10%]">Loading...</div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex min-h-screen bg-gray-100">
//         <ResearcherSideNavBar />
//         <div className="ml-[25%] mt-[10%] text-red-600">Error: {error}</div>
//       </div>
//     );
//   }

//   if (!research) {
//     return (
//       <div className="flex min-h-screen bg-gray-100">
//         <ResearcherSideNavBar />
//         <div className="ml-[25%] mt-[10%]">Research not found</div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <Header />
//       <section className="flex min-h-screen bg-gray-100">
//         <ResearcherSideNavBar />
//         <div className="ml-[25%] mt-[5%]">
//           <div className="space-y-6 text-2xl">
//             <h1>
//               <span className="text-2xl font-bold">Title: </span>
//               {research.researchTitle}
//             </h1>
//             <p>
//               <span className="font-bold">Type:</span> {research.researchType}
//             </p>
//             <p>
//               <span className="font-bold">Status:</span> {research.status}
//             </p>
//             <p>
//               <span className="font-bold">Researcher:</span>{" "}
//               {research.researcher?.id?.firstname}{" "}
//               {research.researcher?.id?.lastname}
//             </p>
//             <p>
//               <span className="font-bold">Uploaded At:</span>{" "}
//               {research.createdAt
//                 ? new Date(research.createdAt).toLocaleString()
//                 : "Unknown"}
//             </p>
//             <a
//               href={research.researchFile}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="text-blue-500 underline"
//             >
//               View Uploaded File
//             </a>
//           </div>
//           {research.status === "accepted" && (
//             <div className="mt-8">
//               <button
//                 onClick={handleFinanceRequest}
//                 className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
//               >
//                 Finance Request Form
//               </button>
//             </div>
//           )}
//           {research.financeRequest?.status === "approved" && (
//             <div className="mt-6">
//               <Button
//                 type="primary"
//                 onClick={handleNavigateToReport}
//                 size="large"
//               >
//                 Submit Progress Report
//               </Button>
//             </div>
//           )}
//         </div>
//       </section>
//     </>
//   );
// };

// export default ResearcherSingleResearchPage;


import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Card, Descriptions, Tag } from "antd";
import Header from "../../../../components/Header_Nav_Bar/Header";
import ResearcherSideNavBar from "../Navigations/ResearcherSideNavbar";
import API from "../../../../api/axios";

interface Research {
  _id: string;
  researchTitle: string;
  researchType: string;
  researchFile: string;
  status: string;
  researcherId: string;
  createdAt: string;
}

interface FinanceRequest {
  _id: string;
  researchId: string;
  status: "pending" | "approved" | "rejected";
  amount: number;
  purpose: string;
  createdAt: string;
}

// interface ProgressReport {
//   _id: string;
//   researchId: string;
//   financeRequestId: string;
//   status: "submitted" | "reviewed";
//   createdAt: string;
// }

const ResearcherSingleResearchPage = () => {
  const { id: researchId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [research, setResearch] = useState<Research | null>(null);
  const [financeRequest, setFinanceRequest] = useState<FinanceRequest | null>(
    null
  );
  // const [progressReport, setProgressReport] = useState<ProgressReport | null>(
  //   null
  // );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 1. Fetch research details
        const researchRes = await API.get(
          `/researcher/researches-list/${researchId}`
        );
        setResearch(researchRes.data.data);

        // 2. Fetch finance request (if exists)
        try {
          const financeRes = await API.get(
            `/researcher/finance-requests`,
            { params: { researchId } }
          );

          if (financeRes.data.success && financeRes.data.data.length > 0) {
            setFinanceRequest(financeRes.data.data[0]);
            // No need to fetch progress reports just to show/hide the button
          }
        } catch {
          console.log("No finance request found");
        }
      } catch (error) {
        console.error("Error fetching research data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [researchId]);

  const handleFinanceRequest = () => {
    navigate(`/researcher/finance-form/${researchId}`);
  };

  // const handleSubmitReport = () => {
  //   if (!financeRequest) return;
  //   navigate(`/researcher/progress-report/${financeRequest._id}`);
  // };


  if (loading) {
    return <div>Loading...</div>;
  }

  if (!research) {
    return <div>Research not found</div>;
  }

  return (
    <>
      <Header />
      <div className="flex min-h-screen bg-gray-100">
        <ResearcherSideNavBar />
        <div className="p-6 mt-[4%] ml-[15%] w-full max-w-[1600px]">
          <Card title="Research Details">
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Title">
                {research.researchTitle}
              </Descriptions.Item>
              <Descriptions.Item label="Type">
                {research.researchType}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag
                  color={
                    research.status === "approved"
                      ? "green"
                      : research.status === "rejected"
                      ? "red"
                      : "orange"
                  }
                >
                  {research.status.toUpperCase()}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Created At">
                {new Date(research.createdAt).toLocaleDateString()}
              </Descriptions.Item>
            </Descriptions>

            {/* Finance Request Section */}
            {research.status === "accepted" && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold">Finance Request</h3>
                {financeRequest ? (
                  <>
                    <Descriptions bordered column={1}>
                      <Descriptions.Item label="Status">
                        <Tag
                          color={
                            financeRequest.status === "approved"
                              ? "green"
                              : financeRequest.status === "rejected"
                              ? "red"
                              : "orange"
                          }
                        >
                          {financeRequest.status.toUpperCase()}
                        </Tag>
                      </Descriptions.Item>
                      <Descriptions.Item label="Amount">
                        ${financeRequest.amount.toFixed(2)}
                      </Descriptions.Item>
                      <Descriptions.Item label="Purpose">
                        {financeRequest.purpose}
                      </Descriptions.Item>
                      <Descriptions.Item label="Submitted On">
                        {new Date(
                          financeRequest.createdAt
                        ).toLocaleDateString()}
                      </Descriptions.Item>
                    </Descriptions>

                    {/* Progress Report Section */}
                    {/* Submit Progress Report Button - Only shown if finance is approved */}
                    {financeRequest?.status === "approved" && (
                      <div className="mt-6">
                        <Button
                          type="primary"
                          onClick={() => navigate("/researcher/finance-report")}
                          size="large"
                        >
                          Submit Progress Report
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <Button type="primary" onClick={handleFinanceRequest}>
                    Request Finance
                  </Button>
                )}
              </div>
            )}
          </Card>
        </div>
      </div>
    </>
  );
};

export default ResearcherSingleResearchPage;