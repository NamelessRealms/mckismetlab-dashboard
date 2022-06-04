import styles from "./DisableBlock.module.scss";

interface IProps {
    open: boolean;
}

export default function DisableBlock(props: IProps) {
    if(props.open) {
        return <div className={styles.disableBlock}></div>;
    } else {
        return <></>;
    }
}