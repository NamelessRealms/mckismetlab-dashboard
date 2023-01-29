import Tooltips from "../tooltips/Tooltips";
import styles from "./TextStateLights.module.scss";

interface IProps {
    title: string;
    state: boolean | null;
    tooltipsTitles?: Array<string>;
}

export default function TextStateLights(props: IProps) {
    return (
        <div className={styles.textStateLights}>
            <h1 className={styles.title}>{props.title}</h1>
            {
                props.tooltipsTitles !== undefined
                    ?
                    <Tooltips title={props.state !== null ? props.state ? props.tooltipsTitles[0] : props.tooltipsTitles[1] : props.tooltipsTitles[2] !== undefined ? props.tooltipsTitles[2] : "ERROR"}>
                        <div className={styles.wrapperStateLights}>
                            {
                                props.state !== null
                                    ?
                                    <span className={styles.stateLights} style={!props.state ? { backgroundColor: "#ed4245" } : {}}></span>
                                    : null
                            }
                        </div>
                    </Tooltips>
                    :
                    <div className={styles.wrapperStateLights}>
                        {
                            props.state !== null
                                ?
                                <span className={styles.stateLights} style={!props.state ? { backgroundColor: "#ed4245" } : {}}></span>
                                : null
                        }
                    </div>

            }
        </div>
    )
}