import Header from "../../../components/Header_Nav_Bar/Header";
import FinanceSideNavBar from "./FinanceSideNavBar";

const FinanceDashboard: React.FC = () => {
  return (
    <>
      <Header />
      <section>
        <FinanceSideNavBar />
        <div className="flex min-h-screen bg-gray-100"></div>
      </section>
    </>
  );
};

export default FinanceDashboard;
