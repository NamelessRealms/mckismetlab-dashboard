import styles from "./TextEditInput.module.scss";

interface IProps {
    value: string;
    editState: boolean;
    onChange?: (value: string) => void;
    className?: string;
}

export default function TextEditInput(props: IProps) {
    return (
        <div className={`${styles.textEditInput} ${props.className}`}>
            {
                props.editState
                    ?
                    <input
                        type="text"
                        value={props.value}
                        onChange={(event) => {
                            if(props.onChange !== undefined) props.onChange(event.target.value);
                        }}
                    />
                    :
                    <h1 className={styles.textEditInputText}>{props.value}</h1>
            }
        </div>
    )
}