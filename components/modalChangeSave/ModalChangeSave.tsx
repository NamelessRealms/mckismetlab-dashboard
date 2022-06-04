import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import styles from "./ModalChangeSave.module.scss";

interface IProps {
    state: boolean;
    onClickConfirm?: () => void;
    onClickCancel?: () => void;
}

export default function ModalChangeSave(props: IProps) {

    const router = useRouter();
    const [warnState, setWarnState] = useState<boolean>(false);

    const onRouteChangeStart = (pathname: string) => {
        if (props.state) {
            setWarnState(true);
            setTimeout(() => setWarnState(false), 500);
            throw `Route change to ${pathname} was aborted (this error can be safely ignored). See https://github.com/zeit/next.js/issues/2476.`;
        }
    }

    useEffect(() => {
        router.events.on("routeChangeStart", onRouteChangeStart);

        return () => {
            router.events.off("routeChangeStart", onRouteChangeStart);
        }
    }, [props.state]);

    return (
        <div className={`${styles.modalChangeSave}`} style={props.state ? {} : { display: "none" }}>
            <div className={`${styles.checkedWarningDiv} ${warnState ? styles.checkedWarning : ""}`}>
                <div className={styles.modalChangeSaveLeft}>
                    <h1 className={`${styles.modalChangeSaveLeftTitle} m-0`}>偵測到已更改！請儲存或是取消。</h1>
                </div>
                <div className={styles.modalChangeSaveRight}>
                    <Button variant="secondary" onClick={props.onClickCancel}>取消</Button>
                    <Button className={`ms-2`} variant="primary" onClick={props.onClickConfirm}>儲存</Button>
                </div>
            </div>
        </div>
    )
}