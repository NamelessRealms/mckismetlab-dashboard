import { ReactElement } from "react";
import DashboardLayout from "../../../../../components/layout/dashboardLayout/DashboardLayout";
import ServerMangeWhitelistLayout from "../../../../../components/layout/serverMangeWhitelistLayout/ServerMangeWhitelistLayout";
import styles from "./ServerMangeWhitelistClear.module.scss";
export default function ServerMangeWhitelistClear() {

    return (
        <div className={styles.serverMangeWhitelistClear}>

        </div>
    )
}

ServerMangeWhitelistClear.getLayout = (page: ReactElement) => {
    return (
        <DashboardLayout>
            <ServerMangeWhitelistLayout>{page}</ServerMangeWhitelistLayout>
        </DashboardLayout>
    );
}

ServerMangeWhitelistClear.requireAuth = true;