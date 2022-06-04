
import { useRouter } from "next/router";
import { ReactElement } from "react"
import { Spinner } from "react-bootstrap";
import PanelLayout from "../../components/layout/panelLayout/PanelLayout"

export default function Panel() {
    return (
        <div className="row justify-content-center align-items-center align-content-center" style={{ height: "50vh" }}>
            <Spinner animation="border" role="status" variant="primary">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        </div>
    )
}

Panel.getLayout = (page: ReactElement) => {
    return <PanelLayout>{page}</PanelLayout>;
}