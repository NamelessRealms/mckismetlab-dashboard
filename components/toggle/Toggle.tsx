import React from "react";
import styles from "./Toggle.module.scss";

type IProps = {
    state: boolean;
    title?: string;
    titleDisplay?: "top" | "left";
    onChange?: (state: boolean) => void;
    wrapperToggleClassName?: string;
    className?: string;
}

export default function Toggle(props: IProps) {

    const [toggleOffDivClassName, setToggleOffDivClassName] = React.useState(props.state ? styles.toggleOnDiv : "");

    return (
        <div className={`${styles.wrapperToggleDiv} ${props.wrapperToggleClassName} ${props.titleDisplay !== undefined ? styles.titleLeftDisplay : null}`}>

            {
                props.title !== undefined
                ?
                <h1 className={styles.toggleTitle}>{props.title}</h1>
                : null
            }

            <div className={`${styles.toggleDiv} ${toggleOffDivClassName} ${props.className}`} onClick={() => {

                setToggleOffDivClassName(toggleOffDivClassName === styles.toggleOnDiv ? "" : styles.toggleOnDiv);
                if (props.onChange !== undefined) props.onChange(!props.state);

            }}>
                <div className={styles.innerCircle}></div>
            </div>
        </div>
    );
}