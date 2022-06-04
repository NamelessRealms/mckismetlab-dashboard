import { ReactElement } from "react";
import PanelLayout from "../../../../components/layout/panelLayout/PanelLayout";

export default function Whitelist() {

    return (
        <div>
            
        </div>
    )
}

Whitelist.getLayout = (page: ReactElement) => {
    return <PanelLayout>{page}</PanelLayout>;
}

Whitelist.requireAuth = true;