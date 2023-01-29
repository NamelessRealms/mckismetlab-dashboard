import { Spinner } from "react-bootstrap";

interface IProps {
    spinnerHeight?: string;
}

export default function SpinnerCenter(props: IProps) {
    return (
        <div className="row justify-content-center align-items-center align-content-center" style={{ height: props.spinnerHeight !== undefined ? props.spinnerHeight : "50hv" }}>
            <Spinner animation="border" role="status" variant="primary">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        </div>
    )
}