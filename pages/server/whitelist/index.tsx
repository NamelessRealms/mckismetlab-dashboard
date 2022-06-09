import { ReactElement, useEffect } from "react";
import PanelLayout from "../../../components/layout/panelLayout/PanelLayout";
// import socketIo from "socket.io-client";

export default function Whitelist() {

    useEffect(() => {

        // const io = socketIo("http://localhost:8030");

        // io.on("message", (message: string) => {
        //     console.log("Message: " , message);
        // });

    }, []);

    return (
        <div>
            
        </div>
    )
}

Whitelist.getLayout = (page: ReactElement) => {
    return <PanelLayout>{page}</PanelLayout>;
}

Whitelist.requireAuth = true;