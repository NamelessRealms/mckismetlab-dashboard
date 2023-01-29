import React from "react";
import styles from "./InputIcon.module.scss";
import { IoSearch } from "react-icons/io5";
import { CgClose } from "react-icons/cg";

type IProps = {
    type: "email" | "text" | "password";
    icon: "email" | "password" | "search";
    onChange?: (value: string) => void;
    className?: string;
    value?: string;
    placeholder?: string;
}
export default function InputIcon(props: IProps) {
    return (
        <div className={`${styles.inputIconDiv} ${props.className}`}>
            <GetIcon iconType={props.icon} />
            <input
                placeholder={props.placeholder}
                type={props.type}
                value={props.value !== undefined ? props.value : ""}
                onChange={(event) => { if (props.onChange !== undefined) props.onChange(event.target.value); }}
            />
            {
                props.icon === "search"
                    ?
                    <CgClose
                        className={styles.closeIcon}
                        size="30"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                            if(props.onChange === undefined) return;
                            props.onChange("");
                        }}
                    />
                    : null
            }
        </div>
    );
}

function GetIcon(props: { iconType: "email" | "password" | "search" }) {

    switch (props.iconType) {
        case "email":
            return (
                // <img className={styles.icon} src={emailImg} alt="email" />
                <></>
            );
        case "password":
            return (
                // <img className={styles.icon} src={passwordImg} alt="password" />
                <></>
            );
        case "search":
            return (
                // <img className={styles.icon} src={search} alt="search" />
                <IoSearch className={styles.icon} size="30" />
            )
    }

}