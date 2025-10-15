import Header from "../../../components/Header_Nav_Bar/Header";
import DirectorateSideNavBar from "./Navigation/DirectorateSideNavBar";


const DirectorateDashboard: React.FC = () => {
    return (
      <>
        <Header />
        <section>
          <DirectorateSideNavBar />
          <div className="flex min-h-screen bg-gray-100"></div>
        </section>
      </>
    );
}

export default DirectorateDashboard;