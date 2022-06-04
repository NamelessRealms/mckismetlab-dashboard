import styles from "./ModalCustomize.module.scss";
import { ReactNode } from "react";

interface IProps {
    state: boolean;
    children: ReactNode;
}

export default function ModalCustomize(props: IProps) {
    return (
        <div className={styles.wrapperModalCustomize} style={!props.state ? { display: "none" } : {}}>
            <div className={styles.container}>
                {props.children}
            </div>
        </div>
    )
}