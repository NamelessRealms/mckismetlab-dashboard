import { ReactElement } from "react";
import { Spinner } from "react-bootstrap";
import DashboardLayout from "../components/layout/dashboardLayout/DashboardLayout";

export default function Dashboard() {
  return (
    <div className="row justify-content-center align-items-center align-content-center" style={{ height: "50vh" }}>
      <Spinner animation="border" role="status" variant="primary">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  )
}

Dashboard.getLayout = (page: ReactElement) => {
  return <DashboardLayout>{page}</DashboardLayout>;
}

Dashboard.requireAuth = true;