import { ReactElement } from "react";
import DashboardLayout from "../../../components/layout/dashboardLayout/DashboardLayout";

export default function LauncherIssues() {

    return (
        <div>
            
        </div>
    )
}

LauncherIssues.getLayout = (page: ReactElement) => {
    return <DashboardLayout>{page}</DashboardLayout>;
}

LauncherIssues.requireAuth = true;