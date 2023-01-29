import { ReactNode, useEffect, useRef, useState } from "react";
import styles from "./Tooltips.module.scss";

interface IProps {
    title: string;
    // placement?: "top" | "left" | "right" | "bottom";
    children: ReactNode
}

export default function Tooltips(props: IProps) {
    return (
        <div className={styles.wrapperTooltip} data-tooltip={props.title}>
            {props.children}
        </div>
    )
}