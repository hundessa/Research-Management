import { useEffect, useState } from "react";
import Header from "../../../../components/Header_Nav_Bar/Header";
import ReviewerSideNavBar from "../Navigation/ReviewerSideNavBar";
import { useParams } from "react-router-dom";
import axios from "axios";
import API from "../../../../api/axios";

interface Researchers {
  name: string;
  id: { firstname: string; lastname: string; email: string };
}

interface Evaluation {
  _id: string;
  reviewer: { _id: string; firstname: string; lastname: string };
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
  defenseDate?: string | null;
}

const ReviewerSingleResearch: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const reviewerId = user?.id;
  const [research, setResearch] = useState<ResearchItem | null>(null);
  const [evaluation, setEvaluation] = useState<number>(0);
  const [evaluationType, setEvaluationType] = useState<string>("pre-defense");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await API.get(`/reviewer-research/${id}`, {
          withCredentials: true,
        });
        console.log("Fetched research:", res.data);
        setResearch(res.data);
      } catch (error: unknown) {
        console.error("Error fetching research detail:", error);
        // setError(error.response?.data?.message || "Failed to load research details");
        if (axios.isAxiosError(error) && error.response?.data?.message) {
          setError(error.response.data.message);
        } else if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Failed to load research details");
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleEvaluationSubmit = async () => {
    if (evaluation < 0 || evaluation > 100) {
      setError("Please enter a valid score between 0 and 100.");
      return;
    }

    try {
      setError(null);
      console.log("Submitting evaluation:", { researchId: id, reviewerId, score: evaluation, evaluationType });

      const response = await API.put(
        `/reviewer-research/${id}/evaluation`,
        {
          score: evaluation,
          reviewerId,
          evaluationPhase: evaluationType,
        },
        { withCredentials: true }
      );

      console.log("Evaluation response:", response.data);
      setResearch(response.data.research);
      alert("Evaluation submitted successfully");
      setEvaluation(0);
    } catch (err: unknown) {
      console.error("Error submitting evaluation:", err);
      // const errorMessage =
      //   error.response?.data?.message || "Failed to submit evaluation";
      let errorMessage = "Failed to submit evaluation";
       if (axios.isAxiosError(err) && err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      alert(errorMessage);
    }
  };

  const hasSubmittedPreDefense = research?.preDefenseEvaluations?.some(
    (e) => e.reviewer._id === reviewerId
  );
  const hasSubmittedPostDefense = research?.postDefenseEvaluations?.some(
    (e) => e.reviewer._id === reviewerId
  );
  
  const isDefenseDateAssigned = !!research?.defenseDate;

  // const isDefenseDatePassed =
  //   research?.defenseDate && new Date(research.defenseDate) <= new Date();
  const isDefenseDatePassed = research?.defenseDate
    ? new Date(research.defenseDate).getTime() < Date.now()
    : false;

  // Add console logs to debug (remove in production)
  console.log("Defense Date:", research?.defenseDate);
  console.log("Current Date:", new Date());
  console.log("Is defense date passed:", isDefenseDatePassed);
  console.log("Has submitted post-defense:", hasSubmittedPostDefense);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <ReviewerSideNavBar />
        <div className="ml-[25%] mt-[10%]">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <ReviewerSideNavBar />
        <div className="ml-[25%] mt-[10%] text-red-600">Error: {error}</div>
      </div>
    );
  }

  if (!research) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <ReviewerSideNavBar />
        <div className="ml-[25%] mt-[10%]">Research not found</div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <section className="flex min-h-screen bg-gray-100">
        <ReviewerSideNavBar />
        <div className="ml-[25%] mt-[5%] w-full max-w-4xl">
          <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
            <h1 className="text-2xl font-bold">
              Title: {research.researchTitle}
            </h1>
            <p>
              <span className="font-bold">Type:</span> {research.researchType}
            </p>
            <p>
              <span className="font-bold">Status:</span> {research.status}
            </p>
            <p>
              <span className="font-bold">Researcher:</span>{" "}
              {research.researcher?.name || "Unknown"}
            </p>
            <p>
              <span className="font-bold">Uploaded At:</span>{" "}
              {research.createdAt
                ? new Date(research.createdAt).toLocaleString()
                : "Unknown"}
            </p>
            {research.defenseDate && (
              <p>
                <span className="font-bold">Defense Date:</span>{" "}
                {new Date(research.defenseDate).toLocaleString()}
              </p>
            )}
            <a
              href={research.researchFile}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              View Uploaded File
            </a>

            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">Evaluation Results</h2>
              <div className="space-y-4">
                <div>
                  <p className="font-semibold">
                    Pre-Defense Average Score:{" "}
                    {research.averagePreDefenseScore !== undefined && research.averagePreDefenseScore !== null
                      ? research.averagePreDefenseScore.toFixed(2)
                      : "Not yet evaluated"}
                  </p>
                  {research.preDefenseEvaluations.length > 0 ? (
                    <ul className="mt-2 space-y-2">
                      {research.preDefenseEvaluations.map(
                        (evaluation, index) => (
                          <li key={index}>
                            {evaluation.reviewer.firstname}{" "}
                            {evaluation.reviewer.lastname}: {evaluation.score}
                            /100 (Submitted:{" "}
                            {new Date(evaluation.submittedAt).toLocaleString()})
                          </li>
                        )
                      )}
                    </ul>
                  ) : (
                    <p>No pre-defense evaluations submitted.</p>
                  )}
                </div>
                <div>
                  <p className="font-semibold">
                    Post-Defense Average Score:{" "}
                    {research.averagePostDefenseScore !== undefined && research.averagePostDefenseScore !== null
                      ? research.averagePostDefenseScore.toFixed(2)
                      : "Not yet evaluated"}
                  </p>
                  {research.postDefenseEvaluations.length > 0 ? (
                    <ul className="mt-2 space-y-2">
                      {research.postDefenseEvaluations.map(
                        (evaluation, index) => (
                          <li key={index}>
                            {evaluation.reviewer.firstname}{" "}
                            {evaluation.reviewer.lastname}: {evaluation.score}
                            /100 (Submitted:{" "}
                            {new Date(evaluation.submittedAt).toLocaleString()})
                          </li>
                        )
                      )}
                    </ul>
                  ) : (
                    <p>No post-defense evaluations submitted.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">Submit Evaluation</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Evaluation Type
                  </label>
                  <select
                    value={evaluationType}
                    onChange={(e) => setEvaluationType(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    // disabled={
                    //   (evaluationType === "pre-defense" &&
                    //     hasSubmittedPreDefense) ||
                    //   (evaluationType === "post-defense" &&
                    //     (hasSubmittedPostDefense || !isDefenseDatePassed))
                    // }
                  >
                    <option
                      value="pre-defense"
                      disabled={hasSubmittedPreDefense}
                    >
                      Pre-Defense Evaluation
                    </option>
                    <option
                      value="post-defense"
                      disabled={hasSubmittedPostDefense || !isDefenseDatePassed}
                    >
                      Post-Defense Evaluation
                    </option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Score (0-100)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Enter your evaluation score"
                    value={evaluation}
                    onChange={(e) => setEvaluation(Number(e.target.value))}
                    // disabled={
                    //   (evaluationType === "pre-defense" &&
                    //     hasSubmittedPreDefense) ||
                    //   (evaluationType === "post-defense" &&
                    //     (hasSubmittedPostDefense || !isDefenseDatePassed))
                    // }
                  />
                </div>
                {error && <p className="text-red-600">{error}</p>}
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
                  onClick={handleEvaluationSubmit}
                  // disabled={
                  //   (evaluationType === "pre-defense" &&
                  //     hasSubmittedPreDefense) ||
                  //   (evaluationType === "post-defense" &&
                  //     (hasSubmittedPostDefense || !isDefenseDatePassed)) ||
                  //   evaluation < 0 ||
                  //   evaluation > 100
                  // }
                >
                  Submit Evaluation
                </button>
                {!isDefenseDateAssigned &&
                  evaluationType === "post-defense" && (
                    <p className="text-yellow-600">
                      Post-defense evaluation will be available after the
                      coordinator assigns a defense date.
                    </p>
                  )}
                {isDefenseDateAssigned &&
                  !isDefenseDatePassed &&
                  evaluationType === "post-defense" && (
                    <p className="text-yellow-600">
                      Post-defense evaluation will be available after the
                      defense date has passed:{" "}
                      {research.defenseDate ? new Date(research.defenseDate).toLocaleString() : "Unknown"}.
                    </p>
                  )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ReviewerSingleResearch;