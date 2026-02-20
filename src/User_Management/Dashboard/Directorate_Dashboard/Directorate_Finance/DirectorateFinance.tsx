import { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, message, Tag, Space, Card } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import Header from "../../../../components/Header_Nav_Bar/Header";
import DirectorateSideNavBar from "../Navigation/DirectorateSideNavBar";
import API from "../../../../api/axios";

interface FinanceRequest {
  _id: string;
  researchId: {
    _id: string;
    researchTitle: string;
  };
  researcherId: {
    _id: string;
    name: string;
    email: string;
  };
  amount: number;
  purpose: string;
  bankDetails: {
    accountName: string;
    accountNumber: string;
    bankName: string;
  };
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

const DirectorateFinanceRequests = () => {
  const [requests, setRequests] = useState<FinanceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchFinanceRequests();
  }, []);

  const fetchFinanceRequests = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://research-management.onrender.com/directorate/finance-requests",
        {
          withCredentials: true,
        }
      );
      setRequests(response.data.data);
    } catch {
      message.error("Failed to fetch finance requests");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (
    requestId: string,
    researchId: string,
    researchTitle: string
  ) => {
    try {
      setActionLoading(true);
      await axios.patch(
        `https://research-management.onrender.com/directorate/finance-requests/${requestId}/approve`,
        {},
        { withCredentials: true }
      );
      message.success("Finance request approved and sent to finance team");

      try {
        await axios.post("https://research-management.onrender.com/directorate-notifications", {
          to: "finance",
          recipientRole: "finance",
          message: `New finance request approved for research: ${researchTitle}`,
          title: "Finance Request Approval",
          type: "finance_request",
          researchId: researchId,
        });
      } catch (notificationError) {
        console.error("Notification creation failed:", notificationError);
        // Continue with success flow even if notification fails
      }

      fetchFinanceRequests();
    } catch {
      message.error("Failed to approve request");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (
    requestId: string,
    researchId: string,
    researchTitle: string,
    researcherId: string
  ) => {
    try {
      setActionLoading(true);
      await API.patch(
        `/directorate/finance-requests/${requestId}/reject`,
        {},
        { withCredentials: true }
      );
      message.success("Finance request rejected");

      try {
        await API.post("/directorate-notifications", {
          to: researcherId,
          recipientRole: "researcher",
          message: `New finance request rejected for research: ${researchTitle}`,
          title: "Finance Request Rejection",
          type: "finance_request",
          researchId: researchId,
        });
      } catch (notificationError) {
        console.error("Notification creation failed:", notificationError);
        // Continue with success flow even if notification fails
      }

      fetchFinanceRequests();
    } catch {
      message.error("Failed to reject request");
    } finally {
      setActionLoading(false);
    }
  };

  const columns = [
    {
      title: "Research Title",
      dataIndex: ["researchId", "researchTitle"],
      key: "researchTitle",
    },
    {
      title: "Researcher",
      dataIndex: ["researcherId", "name"],
      key: "researcher",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount: number) => `$${amount.toFixed(2)}`,
    },
    {
      title: "Purpose",
      dataIndex: "purpose",
      key: "purpose",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag
          color={
            status === "pending"
              ? "orange"
              : status === "approved"
              ? "green"
              : "red"
          }
        >
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Submitted On",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: FinanceRequest) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<CheckOutlined />}
            onClick={() =>
              handleApprove(
                record._id,
                record.researchId._id,
                record.researchId.researchTitle
              )
            }
            loading={actionLoading}
            disabled={record.status !== "pending"}
          >
            Approve
          </Button>
          <Button
            danger
            icon={<CloseOutlined />}
            onClick={() =>
              handleReject(
                record._id,
                record.researchId._id,
                record.researchId.researchTitle,
                record.researcherId._id
              )
            }
            loading={actionLoading}
            disabled={record.status !== "pending"}
          >
            Reject
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Header />
      <div className="flex min-h-screen bg-gray-100">
        <DirectorateSideNavBar />
        <div className="p-6 mt-[6%] ml-[15%] w-full max-w-[1600px]">
          <Card title="Finance Requests" bordered={false}>
            <Table
              columns={columns}
              dataSource={requests}
              rowKey="_id"
              loading={loading}
              expandable={{
                expandedRowRender: (record) => (
                  <div className="p-4 bg-gray-50 rounded">
                    <h3 className="font-medium mb-2">Bank Details</h3>
                    <p>Account Name: {record.bankDetails.accountName}</p>
                    <p>Account Number: {record.bankDetails.accountNumber}</p>
                    <p>Bank Name: {record.bankDetails.bankName}</p>
                  </div>
                ),
              }}
            />
          </Card>
        </div>
      </div>
    </>
  );
};

export default DirectorateFinanceRequests;
