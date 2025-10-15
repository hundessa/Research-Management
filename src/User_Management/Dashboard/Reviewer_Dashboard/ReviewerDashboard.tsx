import Header from "../../../components/Header_Nav_Bar/Header";
import ReviewerSideNavBar from "./Navigation/ReviewerSideNavBar";


const ReviewerDashboard: React.FC = () => {
    return (
      <>
        <Header />
        <section>
          <ReviewerSideNavBar />
          <div className="flex min-h-screen bg-gray-100"></div>
        </section>
      </>
    );
}


export default ReviewerDashboard;