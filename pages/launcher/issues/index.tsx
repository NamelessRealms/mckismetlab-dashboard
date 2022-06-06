import { ReactElement } from "react";
import PanelLayout from "../../../components/layout/panelLayout/PanelLayout";

export default function LauncherIssues() {

    return (
        <div>
            
        </div>
    )
}

LauncherIssues.getLayout = (page: ReactElement) => {
    return <PanelLayout>{page}</PanelLayout>;
}