import { useState, FormEvent, useEffect } from "react";
import axios from "axios";
import Header from "../../../../components/Header_Nav_Bar/Header";
import ResearcherSideNavBar from "../Navigations/ResearcherSideNavbar";
import { useLocation, useNavigate } from "react-router-dom";

interface FormData {
  amount: string;
  purpose: string;
  accountName: string;
  accountNumber: string;
  bankName: string;
}

interface FormErrors {
  amount?: string;
  purpose?: string;
  accountName?: string;
  accountNumber?: string;
  bankName?: string;
}

interface FinanceRequest {
  _id: string;
  amount: number;
  purpose: string;
  status: string;
  createdAt: string;
  bankDetails: {
    accountName: string;
    accountNumber: string;
    bankName: string;
  };
}

const ResearcherFinanceForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    amount: "",
    purpose: "",
    accountName: "",
    accountNumber: "",
    bankName: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [researchId, setResearchId] = useState<string>("");
  const [researchTitle, setResearchTitle] = useState<string>("");
  const [financeRequests, setFinanceRequests] = useState<FinanceRequest[]>([]);
  const [loadingRequests, setLoadingRequests] = useState<boolean>(true);

  // Get researchId and fetch existing requests
  useEffect(() => {
    if (location.state?.researchId) {
      setResearchId(location.state.researchId);
      fetchResearchDetails(location.state.researchId);
      fetchFinanceRequests(location.state.researchId);
      return;
    }

    const fetchCurrentResearch = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const response = await axios.get(
          `http://localhost:4001/researcher/researches-list?researcherId=${user.id}`
        );

        if (response.data.data?.length > 0) {
          const currentResearch = response.data.data[0];
          setResearchId(currentResearch._id);
          setResearchTitle(currentResearch.researchTitle);
          fetchFinanceRequests(currentResearch._id);
        }
      } catch (error) {
        console.error("Failed to fetch current research:", error);
      }
    };

    fetchCurrentResearch();
  }, [location.state]);

  const fetchResearchDetails = async (id: string) => {
    try {
      const response = await axios.get(
        `http://localhost:4001/researcher/researches-list/${id}`
      );
      setResearchTitle(response.data.data.researchTitle);
    } catch (error) {
      console.error("Failed to fetch research details:", error);
    }
  };

  const fetchFinanceRequests = async (researchId: string) => {
    try {
      setLoadingRequests(true);
      const response = await axios.get(
        `http://localhost:4001/researcher/finance-requests?researchId=${researchId}`
      );
      setFinanceRequests(response.data.data);
    } catch (error) {
      console.error("Failed to fetch finance requests:", error);
    } finally {
      setLoadingRequests(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.amount || isNaN(Number(formData.amount))) {
      newErrors.amount = "Valid amount is required";
    }
    if (!formData.purpose.trim()) {
      newErrors.purpose = "Purpose is required";
    }
    if (!formData.accountName.trim()) {
      newErrors.accountName = "Account name is required";
    }
    if (!formData.accountNumber.trim()) {
      newErrors.accountNumber = "Account number is required";
    }
    if (!formData.bankName.trim()) {
      newErrors.bankName = "Bank name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (!researchId) {
      alert("No research project selected");
      return;
    }

    setIsSubmitting(true);

    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const researcherId = user?.id;
      const requestData = {
        researchId,
        researcherId,
        amount: Number(formData.amount),
        purpose: formData.purpose.trim(),
        bankDetails: {
          accountName: formData.accountName.trim(),
          accountNumber: formData.accountNumber.trim(),
          bankName: formData.bankName.trim(),
        },
      };

      await axios.post(
        "http://localhost:4001/researcher/finance-submit",
        requestData
      );

      try {
        await axios.post("http://localhost:4001/researcher-notifications", {
          from: researcherId,
          to: "directorate",
          recipientRole: "directorate",
          message: `New finance request submitted for research: ${researchTitle}`,
          title: "Finance Request Submission",
          type: "finance_request",
          researchId: researchId,
        });
      } catch (notificationError) {
        console.error("Notification creation failed:", notificationError);
      }

      // Refresh the requests list after submission
      await fetchFinanceRequests(researchId);

      setSubmitSuccess(true);
      setFormData({
        amount: "",
        purpose: "",
        accountName: "",
        accountNumber: "",
        bankName: "",
      });

      setTimeout(() => setSubmitSuccess(false), 2000);
    } catch (error) {
      console.error("Submission failed:", error);
      alert("Failed to submit form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      <Header />
      <div className="flex min-h-screen bg-gray-100">
        <ResearcherSideNavBar />
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            {/* Finance Request Form */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-2xl font-bold mb-6">
                Finance Release Request
              </h2>
              {researchTitle && (
                <div className="mb-4 p-3 bg-blue-50 rounded-md">
                  <p className="font-semibold">Research Project:</p>
                  <p>{researchTitle}</p>
                </div>
              )}
              {submitSuccess ? (
                <div className="p-4 bg-green-100 text-green-800 rounded mb-4">
                  Your finance release request has been submitted successfully!
                </div>
              ) : (
                <form onSubmit={onSubmit} className="space-y-4">
                  {/* Amount */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Amount Requested
                    </label>
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                    {errors.amount && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.amount}
                      </p>
                    )}
                  </div>

                  {/* Purpose */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Purpose
                    </label>
                    <textarea
                      name="purpose"
                      value={formData.purpose}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                    {errors.purpose && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.purpose}
                      </p>
                    )}
                  </div>

                  {/* Bank Details */}
                  <div className="border-t pt-4">
                    <h3 className="text-lg font-medium mb-3">Bank Details</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Account Name
                        </label>
                        <input
                          type="text"
                          name="accountName"
                          value={formData.accountName}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border rounded-md"
                        />
                        {errors.accountName && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.accountName}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Account Number
                        </label>
                        <input
                          type="text"
                          name="accountNumber"
                          value={formData.accountNumber}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border rounded-md"
                        />
                        {errors.accountNumber && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.accountNumber}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Bank Name
                        </label>
                        <input
                          type="text"
                          name="bankName"
                          value={formData.bankName}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border rounded-md"
                        />
                        {errors.bankName && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.bankName}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                    >
                      {isSubmitting ? "Submitting..." : "Submit Request"}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Previous Financial Requests Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-6">Previous Requests</h2>

              {loadingRequests ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : financeRequests.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  No financial requests submitted yet.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Purpose
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Account Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                       
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {financeRequests.map((request) => (
                        <tr key={request._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            {request.amount.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-normal max-w-xs">
                            {request.purpose}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {request.bankDetails.accountName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                                request.status
                              )}`}
                            >
                              {request.status}
                            </span>
                          </td>
                          
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResearcherFinanceForm;
