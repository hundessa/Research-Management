import axios from "axios";
import Header from "../../../../components/Header_Nav_Bar/Header";
import CoordinatorSideNavBar from "../Navigation/CoordinatorSideNavBar";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaCheck, FaTimes } from "react-icons/fa";

interface Researchers {
  name: string;
  id: string;
}

interface Evaluation {
  _id: string;
  reviewer: User;
  score: number;
  submittedAt: string;
}

interface ResearchItem {
  _id: string;
  researchTitle: string;
  researchType: string;
  researchFile: string;
  status: string;
  researcher: Researchers;
  createdAt: string;
  preDefenseEvaluations: Evaluation[];
  postDefenseEvaluations: Evaluation[];
  averagePreDefenseScore?: number | null;
  averagePostDefenseScore?: number | null;
  reviewers?: string[];
  defenseDate?: string | null;
  decisionComment?: string;
}

interface User {
  _id: string;
  firstname: string;
  lastname: string;
  email?: string;
}

const CoordinatorSingleResearchPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [research, setResearch] = useState<ResearchItem | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedReviewers, setSelectedReviewers] = useState<string[]>([]);
  const [defenseDate, setDefenseDate] = useState<string>("");
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [decisionComment, setDecisionComment] = useState("");
  const [isMakingDecision, setIsMakingDecision] = useState(false);

  useEffect(() => {
    const fetchResearchData = async () => {
      try {
        setLoading(true);
        const [researchRes, usersRes] = await Promise.all([
          axios.get(`http://localhost:4001/coordinator-researches-list/${id}`, {
            withCredentials: true,
          }),
          axios.get("http://localhost:4001/coordinator-users-list", {
            withCredentials: true,
          }),
        ]);

        setResearch(researchRes.data);
        setUsers(usersRes.data.filter((user: User) => user.role === "reviewer"));

        if (researchRes.data.reviewers) {
          setSelectedReviewers(researchRes.data.reviewers);
        }
        if (researchRes.data.defenseDate) {
          setDefenseDate(
            new Date(researchRes.data.defenseDate).toISOString().slice(0, 16)
          );
        }
      } catch (error: any) {
        console.error("Error fetching data:", error);
        setError(error.response?.data?.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchResearchData();
  }, [id]);

  const handleStatusUpdate = async () => {
    if (!research || !id || selectedReviewers.length !== 3) {
      alert("Please select exactly 3 reviewers.");
      return;
    }

    try {
      setActionLoading(true);
      setError(null);
      const response = await axios.patch(
        `http://localhost:4001/coordinator-researches-list/${id}`,
        {
          status: "underreview",
          reviewers: selectedReviewers,
        },
        { withCredentials: true }
      );

      setResearch(response.data);
      
      // Notify reviewers
      await Promise.all(
        selectedReviewers.map((reviewerId) =>
          axios.post(
            "http://localhost:4001/coordinator-notifications",
            {
              to: reviewerId,
              message: `You have been assigned to review the research titled "${research.researchTitle}".`,
              researchId: id,
              title: research.researchTitle,
              type: "review_assignment",
              file: research.researchFile,
              recipientRole: "reviewer",
            },
            { withCredentials: true }
          )
        )
      );

      alert("Reviewers assigned and notified successfully.");
    } catch (error: any) {
      console.error("Failed to assign reviewers:", error);
      setError(error.response?.data?.message || "Failed to assign reviewers");
    } finally {
      setActionLoading(false);
    }
  };

  const handleSetDefenseDate = async () => {
    if (!defenseDate) {
      alert("Please select a defense date");
      return;
    }

    try {
      setActionLoading(true);
      setError(null);
      const response = await axios.patch(
        `http://localhost:4001/coordinator-researches-list/${id}/defense-date`,
        { defenseDate: new Date(defenseDate).toISOString() },
        { withCredentials: true }
      );

      setResearch(response.data.research);
      setShowDatePicker(false);
      setDefenseDate(
        new Date(response.data.research.defenseDate).toISOString().slice(0, 16)
      );

      // Notify researcher and reviewers
      await Promise.all([
        axios.post(
          "http://localhost:4001/coordinator-notifications",
          {
            to: research.researcher.id,
            message: `Your research "${research.researchTitle}" defense has been scheduled for ${new Date(defenseDate).toLocaleString()}.`,
            researchId: id,
            title: research.researchTitle,
            type: "defense_scheduled",
            file: research.researchFile,
            recipientRole: "researcher",
          }, 
          { withCredentials: true }
        ),
        ...(research.reviewers?.map(reviewerId => 
          axios.post(
            "http://localhost:4001/coordinator-notifications",
            {
              to: reviewerId,
              message: `The defense for research "${research.researchTitle}" has been scheduled for ${new Date(defenseDate).toLocaleString()}.`,
              researchId: id,
              title: research.researchTitle,
              type: "defense_scheduled",
              file: research.researchFile,
              recipientRole: "reviewer",
            },
            { withCredentials: true }
          )
        ) || [])
      ]);

      alert("Defense date set and notifications sent successfully.");
    } catch (error: any) {
      console.error("Failed to set defense date:", error);
      setError(error.response?.data?.message || "Failed to set defense date");
    } finally {
      setActionLoading(false);
    }
  };

  const handleAcceptEvaluations = async () => {
    if (!research || !id) return;

    try {
      setActionLoading(true);
      setError(null);
      
      // Update status to "pre-defense-reviewed"
      const response = await axios.patch(
        `http://localhost:4001/coordinator-researches-list/${id}/accept-evaluations`,
        { status: "pre-defense-reviewed" },
        { withCredentials: true }
      );

      setResearch(response.data.research);

      // Notify researcher
      await axios.post(
        "http://localhost:4001/coordinator-notifications",
        {
          to: research.researcher.id,
          message: `All evaluations for your research "${research.researchTitle}" have been accepted by the coordinator.`,
          researchId: id,
          title: research.researchTitle,
          type: "evaluations_accepted",
          file: research.researchFile,
          recipientRole: "researcher",
        },
        { withCredentials: true }
      );

      alert("Evaluations accepted and researcher notified.");
    } catch (error: any) {
      console.error("Failed to accept evaluations:", error);
      setError(error.response?.data?.message || "Failed to accept evaluations");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectEvaluations = async () => {
    if (!research || !id) return;

    try {
      setActionLoading(true);
      setError(null);
      
      // Update status to "evaluations-rejected"
      const response = await axios.patch(
        `http://localhost:4001/coordinator-researches-list/${id}/reject-evaluations`,
        { status: "evaluations-rejected" },
        { withCredentials: true }
      );

      setResearch(response.data.research);

      // Notify reviewers
      await Promise.all(
        research.reviewers?.map(reviewerId =>
          axios.post(
            "http://localhost:4001/coordinator-notifications",
            {
              to: reviewerId,
              message: `Your evaluations for research "${research.researchTitle}" have been rejected by the coordinator. Please review and resubmit.`,
              researchId: id,
              title: research.researchTitle,
              type: "evaluations_rejected",
              file: research.researchFile,
              recipientRole: "reviewer",
            },
            { withCredentials: true }
          )
        ) || []
      );

      alert("Evaluations rejected and reviewers notified.");
    } catch (error: any) {
      console.error("Failed to reject evaluations:", error);
      setError(error.response?.data?.message || "Failed to reject evaluations");
    } finally {
      setActionLoading(false);
    }
  };

  const handleAcceptResearch = async () => {
    if (!research || !id) return;

    try {
      setIsMakingDecision(true);
      setError(null);

      const response = await axios.patch(
        `http://localhost:4001/coordinator-researches-list/${id}/decision`,
        {
          status: "accepted",
          decisionComment:
            decisionComment || "Research accepted by coordinator",
        },
        { withCredentials: true }
      );

      setResearch(response.data.research);

      // Send notification to researcher
      await axios.post(
        "http://localhost:4001/coordinator-notifications",
        {
          to: research.researcher.id,
          recipientRole: "researcher",
          message: `Your research "${research.researchTitle}" has been accepted. ${decisionComment}`,
          researchId: id,
          type: "research_accepted",
        },
        { withCredentials: true }
      );

      alert("Research accepted and researcher notified");
      setDecisionComment("");
    } catch (error) {
      console.error("Accept failed:", error);
      setError("Failed to accept research");
    } finally {
      setIsMakingDecision(false);
    }
  };

  const handleRejectResearch = async () => {
    if (!research || !id) return;

    try {
      setIsMakingDecision(true);
      setError(null);

      const response = await axios.patch(
        `http://localhost:4001/coordinator-researches-list/${id}/decision`,
        {
          status: "rejected",
          decisionComment: decisionComment || "Research needs revisions",
        },
        { withCredentials: true }
      );

      setResearch(response.data.research);

      // Send notification to researcher
      await axios.post(
        "http://localhost:4001/coordinator-notifications",
        {
          to: research.researcher.id,
          recipientRole: "researcher",
          message: `Your research "${research.researchTitle}" requires revisions. ${decisionComment}`,
          researchId: id,
          type: "research_rejected",
        },
        { withCredentials: true }
      );

      alert("Research rejected and researcher notified");
      setDecisionComment("");
    } catch (error) {
      console.error("Reject failed:", error);
      setError("Failed to reject research");
    } finally {
      setIsMakingDecision(false);
    }
  };
  

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <CoordinatorSideNavBar />
        <div className="ml-[25%] mt-[10%]">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <CoordinatorSideNavBar />
        <div className="ml-[25%] mt-[10%] text-red-600">Error: {error}</div>
      </div>
    );
  }

  if (!research) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <CoordinatorSideNavBar />
        <div className="ml-[25%] mt-[10%]">Research not found</div>
      </div>
    );
  }

  const allPreEvaluationsSubmitted = research.preDefenseEvaluations?.length === 3;
  const showEvaluationActions = allPreEvaluationsSubmitted && 
    (research.status === "underreview" || research.status === "evaluations-rejected");

  return (
    <>
      <Header />
      <section className="flex min-h-screen bg-gray-100">
        <CoordinatorSideNavBar />
        <div className="ml-[25%] mt-[5%] p-6 w-full max-w-5xl">
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          {/* Research Details Card */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h1 className="text-2xl font-bold mb-4">Research Details</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p>
                  <span className="font-semibold">Title:</span>{" "}
                  {research.researchTitle}
                </p>
                <p>
                  <span className="font-semibold">Type:</span>{" "}
                  {research.researchType}
                </p>
                <p>
                  <span className="font-semibold">Status:</span>{" "}
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      research.status === "underreview"
                        ? "bg-yellow-100 text-yellow-800"
                        : research.status === "pre-defense-reviewed"
                        ? "bg-blue-100 text-blue-800"
                        : research.status === "under-defense"
                        ? "bg-purple-100 text-purple-800"
                        : research.status === "post-defense-reviewed"
                        ? "bg-green-100 text-green-800"
                        : research.status === "evaluations-rejected"
                        ? "bg-orange-100 text-orange-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {research.status}
                  </span>
                </p>
              </div>
              <div>
                <p>
                  <span className="font-semibold">Researcher:</span>{" "}
                  {research.researcher?.name || "Unknown"}
                </p>
                <p>
                  <span className="font-semibold">Uploaded At:</span>{" "}
                  {new Date(research.createdAt).toLocaleString()}
                </p>
                <a
                  href={research.researchFile}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline hover:text-blue-700"
                >
                  View Uploaded File
                </a>
              </div>
            </div>
          </div>

          {/* Pre-Defense Evaluations Section */}
          {research.preDefenseEvaluations &&
            research.preDefenseEvaluations.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">
                    Pre-Defense Evaluation Results
                  </h2>
                  {showEvaluationActions && (
                    <div className="flex space-x-2">
                      <button
                        onClick={handleAcceptEvaluations}
                        disabled={actionLoading}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-green-300"
                      >
                        {actionLoading ? "Processing..." : "Accept Evaluations"}
                      </button>
                      <button
                        onClick={handleRejectEvaluations}
                        disabled={actionLoading}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-red-300"
                      >
                        {actionLoading ? "Processing..." : "Reject Evaluations"}
                      </button>
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <p className="font-semibold">
                    Evaluations Submitted:{" "}
                    {research.preDefenseEvaluations.length}/
                    {research.reviewers?.length || 3}
                  </p>
                  {research.averagePreDefenseScore && (
                    <p className="font-semibold">
                      Average Score:{" "}
                      {research.averagePreDefenseScore.toFixed(2)}/100
                    </p>
                  )}
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-medium mb-2">Individual Evaluations:</h3>
                  <div className="space-y-3">
                    {research.preDefenseEvaluations.map((evaluation) => (
                      <div
                        key={evaluation._id}
                        className="flex justify-between items-center border-b pb-2"
                      >
                        <div>
                          <p className="font-medium">
                            {evaluation.reviewer?.firstname}{" "}
                            {evaluation.reviewer?.lastname}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(evaluation.submittedAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="text-lg font-bold">
                          {evaluation.score}/100
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          {/* Post-Defense Evaluations Section */}
          {research.postDefenseEvaluations &&
            research.postDefenseEvaluations.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-bold mb-4">
                  Post-Defense Evaluation Results
                </h2>
                <div className="mb-4">
                  <p className="font-semibold">
                    Evaluations Submitted:{" "}
                    {research.postDefenseEvaluations.length}/
                    {research.reviewers?.length || 3}
                  </p>
                  {research.averagePostDefenseScore && (
                    <p className="font-semibold">
                      Average Score:{" "}
                      {research.averagePostDefenseScore.toFixed(2)}/100
                    </p>
                  )}
                </div>
                <div className="border-t pt-4">
                  <h3 className="font-medium mb-2">Individual Evaluations:</h3>
                  <div className="space-y-3">
                    {research.postDefenseEvaluations.map((evaluation) => (
                      <div
                        key={evaluation._id}
                        className="flex justify-between items-center border-b pb-2"
                      >
                        <div>
                          <p className="font-medium">
                            {evaluation.reviewer?.firstname}{" "}
                            {evaluation.reviewer?.lastname}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(evaluation.submittedAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="text-lg font-bold">
                          {evaluation.score}/100
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          {/* Reviewer Assignment */}
          {research.status === "pending" && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Assign Reviewers</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select exactly 3 reviewers
                </label>
                <div className="w-full rounded-md border border-gray-300 bg-white p-4 max-h-[300px] overflow-y-auto">
                  {users.map((user) => (
                    <label
                      key={user._id}
                      className="flex items-center space-x-3 py-2 px-2 hover:bg-gray-50 rounded-md cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        value={user._id}
                        checked={selectedReviewers.includes(user._id)}
                        onChange={(e) => {
                          const value = e.target.value;
                          setSelectedReviewers((prev) =>
                            e.target.checked
                              ? prev.length >= 3
                                ? (alert(
                                    "You can only select up to 3 reviewers."
                                  ),
                                  prev)
                                : [...prev, value]
                              : prev.filter((id) => id !== value)
                          );
                        }}
                        className="form-checkbox h-5 w-5 text-indigo-600 border-gray-300 rounded"
                      />
                      <span className="text-gray-700">
                        {user.firstname} {user.lastname}
                        {user.email && (
                          <span className="text-gray-500 text-sm ml-2">
                            ({user.email})
                          </span>
                        )}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  className={`px-4 py-2 rounded-lg ${
                    selectedReviewers.length === 3
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                  onClick={handleStatusUpdate}
                  disabled={selectedReviewers.length !== 3 || actionLoading}
                >
                  {actionLoading ? "Assigning..." : "Assign Reviewers"}
                </button>
              </div>
            </div>
          )}

          {/* Schedule Defense Section */}
          {research.status === "reviewed" &&
            !research.defenseDate && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-bold mb-4">Schedule Defense</h2>
                {!showDatePicker ? (
                  <button
                    onClick={() => setShowDatePicker(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Set Defense Date
                  </button>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Defense Date and Time
                      </label>
                      <input
                        type="datetime-local"
                        value={defenseDate}
                        onChange={(e) => setDefenseDate(e.target.value)}
                        min={new Date().toISOString().slice(0, 16)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={handleSetDefenseDate}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-green-300"
                        disabled={!defenseDate || actionLoading}
                      >
                        {actionLoading ? "Scheduling..." : "Confirm Date"}
                      </button>
                      <button
                        onClick={() => setShowDatePicker(false)}
                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

          {/* Defense Information */}
          {research.defenseDate && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-2">Defense Information</h2>
              <p className="font-medium">
                Scheduled for: {new Date(research.defenseDate).toLocaleString()}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {Math.ceil(
                  (new Date(research.defenseDate).getTime() - Date.now()) /
                    (1000 * 60 * 60 * 24)
                )}{" "}
                days remaining
              </p>
              {research.status === "under-defense" && (
                <div className="mt-4 p-3 bg-yellow-50 rounded border border-yellow-200">
                  <p className="text-yellow-800">
                    Defense is currently in progress
                  </p>
                </div>
              )}
            </div>
          )}
          {research.postDefenseEvaluations?.length === research.reviewers?.length &&
            research.status === "finalized" && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
                <h3 className="text-lg font-semibold mb-3">
                  Final Research Decision
                </h3>
                <textarea
                  value={decisionComment}
                  onChange={(e) => setDecisionComment(e.target.value)}
                  placeholder="Enter your final decision comments..."
                  className="w-full p-3 border rounded mb-3"
                  rows={3}
                />
                <div className="flex space-x-3">
                  <button
                    onClick={handleAcceptResearch}
                    disabled={isMakingDecision}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-green-300"
                  >
                    <FaCheck className="mr-2" />
                    {isMakingDecision ? "Processing..." : "Approve Research"}
                  </button>
                  <button
                    onClick={handleRejectResearch}
                    disabled={isMakingDecision}
                    className="flex items-center px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-red-300"
                  >
                    <FaTimes className="mr-2" />
                    {isMakingDecision ? "Processing..." : "Request Revisions"}
                  </button>
                </div>
              </div>
            )}
        </div>
      </section>
    </>
  );
};

export default CoordinatorSingleResearchPage;