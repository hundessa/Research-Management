import { useState, useEffect } from "react";
import { Button, Form, Input, Upload, message, Card, Table, Tag, UploadFile } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import Header from "../../../../components/Header_Nav_Bar/Header";
import ResearcherSideNavBar from "../Navigations/ResearcherSideNavbar";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../../../firebase";
import { useParams } from "react-router-dom";
import API from "../../../../api/axios";

const { TextArea } = Input;
// const storage = getStorage(app);

interface Finance {
  _id: string;
  amount: number;
  purpose: string;
  status: "approved" | "pending" | "rejected";
  createdAt: string;
  researchId: string;
}

interface ProgressReport {
  _id: string;
  financeId: string;
  report: string;
  attachments: string[];
  status: "submitted" | "reviewed";
  createdAt: string;
}

const ResearcherFinanceReports = () => {
  const [finances, setFinances] = useState<Finance[]>([]);
  const [reports, setReports] = useState<ProgressReport[]>([]);
  const [loading, setLoading] = useState(false);
  // const [fileList, setFileList] = useState<unknown[]>([]);
    const [fileList, setFileList] = useState<UploadFile<File>[]>([]);
  const [uploading, setUploading] = useState(false);
  const { researchId } = useParams<{ researchId: string }>();
  const [form] = Form.useForm();

  const currentUser = JSON.parse(localStorage.getItem("user") || "");

  useEffect(() => {
    fetchFinances();
    fetchReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [researchId]);

  const fetchFinances = async () => {
    try {
      setLoading(true);
      const response = await API.get(
        "/researcher/finance-requests",
        { withCredentials: true }
      );
      setFinances(response.data.data);
      console.log("finance datas: ", finances);
      
    } catch {
      message.error("Failed to fetch finances");
    } finally {
      setLoading(false);
    }
  };

  const fetchReports = async () => {
    try {
      const response = await API.get(
        "/researcher/progress-reports",
        { withCredentials: true }
      );
      setReports(response.data.data);
    } catch {
      message.error("Failed to fetch progress reports");
    }
  };

  const uploadFilesToFirebase = async (files: UploadFile[]) => {
    const uploadPromises = files.map(async (file) => {
      // Ensure we have a proper file object
      // const fileObj = file.originFileObj || file;
          const fileObj = "originFileObj" in file && file.originFileObj ? (file.originFileObj as File) : (file as unknown as File);

      // Generate a unique filename with timestamp
      const timestamp = Date.now();
      const fileExtension = fileObj.name.split(".").pop();
      const fileName = `report_${timestamp}.${fileExtension}`;

      const storageRef = ref(storage, `progress-reports/${fileName}`);
      await uploadBytes(storageRef, fileObj);
      return getDownloadURL(storageRef);
    });
    return Promise.all(uploadPromises);
  };

  interface ProgressReportFormValues {
    amountSpent: number;
    report: string;
    attachments?: UploadFile[];
  }
  
  const onFinish = async (values: ProgressReportFormValues) => {
      console.log("✅ onFinish TRIGGERED", values);
      try {
        // Validate required data
        if (!researchId || !currentUser?.id) {
          message.error("Missing research or user information");
          return;
        }
  
        setLoading(true);
        setUploading(true);
  
        // Upload files to Firebase if any
        let attachments: string[] = [];
        if (fileList.length > 0) {
          try {
            attachments = await uploadFilesToFirebase(fileList);
          } catch (uploadError) {
            console.error("File upload failed:", uploadError);
            message.error("Failed to upload attachments");
            return;
          }
        }
  
        // Prepare payload with proper data types
        const payload = {
          researchId: researchId,
          researcherId: currentUser.id,
          amountSpent: Number(values.amountSpent), // Ensure number type
          report: values.report,
          attachments,
        };
  
        console.log("Submitting payload:", payload); // Debug log
  
        // Submit report to backend
        const response = await API.post(
          "/researcher/progress-reports",
          payload,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
  
        if (response.data.success) {
          message.success("Progress report submitted successfully");
          form.resetFields();
          setFileList([]);
          fetchReports();
        } else {
          message.error(response.data.message);
        }
      } catch (error: unknown) {
        console.error("Submission error:", error);
        if (
          typeof error === "object" &&
          error !== null &&
          "response" in error &&
          typeof (error as { response?: { data?: { message?: string; error?: string } } }).response === "object"
        ) {
          const err = error as { response?: { data?: { message?: string; error?: string } } };
          message.error(
            err.response?.data?.message ||
              err.response?.data?.error ||
              "Failed to submit progress report"
          );
        } else {
          message.error("Failed to submit progress report");
        }
      } finally {
        setLoading(false);
        setUploading(false);
      }
    };

  const onFinishFailed = (errorInfo: unknown) => {
    console.log("Failed:", errorInfo);
    message.error("Please fill all required fields correctly");
  };

  const columns = [
    {
      title: "Finance ID",
      dataIndex: "financeId",
      key: "financeId",
    },
    {
      title: "Amount Spent",
      dataIndex: "amountSpent",
      key: "amountSpent",
      render: (amount: number) => `$${amount?.toFixed(2) || "0.00"}`,
    },
    {
      title: "Report",
      dataIndex: "report",
      key: "report",
      render: (text: string) => <div className="line-clamp-2">{text}</div>,
    },
    {
      title: "Attachments",
      dataIndex: "attachments",
      key: "attachments",
      render: (files: string[]) => (
        <div>
          {files?.map((file, index) => (
            <a
              key={index}
              href={file}
              target="_blank"
              rel="noopener noreferrer"
            >
              Attachment {index + 1}
            </a>
          ))}
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "submitted" ? "blue" : "green"}>
          {status?.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Submitted On",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
  ];

  return (
    <>
      <Header />
      <div className="flex min-h-screen bg-gray-100">
        <ResearcherSideNavBar />
        <div className="p-6 mt-[4%] ml-[15%] w-full max-w-[1600px]">
          <div className="grid grid-cols-1 gap-6">
            <Card title="Submit Progress Report" variant="outlined">
              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                initialValues={{ attachments: [] }}
              >
                <Form.Item
                  name="amountSpent"
                  label="Amount Spent"
                  rules={[
                    { required: true, message: "Please enter amount spent" },
                    () => ({
                      validator(_, value) {
                        if (value <= 0) {
                          return Promise.reject(
                            "Amount must be greater than 0"
                          );
                        }
                        return Promise.resolve();
                      },
                    }),
                  ]}
                >
                  <Input
                    type="number"
                    prefix=""
                    step="0.01"
                    min="0"
                    placeholder="Enter amount spent from approved funds"
                  />
                </Form.Item>

                <Form.Item
                  name="report"
                  label="Progress Report"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your progress report",
                    },
                  ]}
                >
                  <TextArea
                    rows={6}
                    placeholder="Describe how the funds were used and the progress made..."
                  />
                </Form.Item>

                <Form.Item name="attachments" label="Supporting Documents">
                  <Upload
                    multiple
                    fileList={fileList}
                    beforeUpload={(file) => {
                      setFileList((prev) => [...prev, file]);
                      return false;
                    }}
                    onRemove={(file) => {
                      setFileList((prev) =>
                        prev.filter((f) => f.uid !== file.uid)
                      );
                    }}
                    accept=".pdf,.doc,.docx,.jpg,.png,.jpeg"
                  >
                    <Button icon={<UploadOutlined />} loading={uploading}>
                      Click to Upload
                    </Button>
                  </Upload>
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading || uploading}
                    // disabled={uploading}
                  >
                    Submit Report
                  </Button>
                </Form.Item>
              </Form>
            </Card>

            <Card title="Previous Reports" bordered={false}>
              <Table
                columns={columns}
                dataSource={reports}
                rowKey="_id"
                loading={loading}
                pagination={{ pageSize: 5 }}
              />
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResearcherFinanceReports;