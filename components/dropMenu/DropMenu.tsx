import React, { useEffect, useRef } from "react";
import styles from "./DropMenu.module.scss";
import Trail from "../animations/trail/Trail";
import { v4 as uuidV4 } from "uuid";
import { IoChevronDownOutline } from "react-icons/io5";
import DisableBlock from "../disableBlock/DisableBlock";

interface IProps<Type> {
    label?: string;
    items: Array<{
        label: string;
        value: Type;
    }>;

    value: Type;
    disable?: boolean;
    wrapperClassName?: string;
    className?: string;
    onChange?: (value: Type) => void;
}

export default function DropMenu<Type>(props: IProps<Type>) {

    const [value, setValue] = React.useState<Type>(props.value);
    const [open, setOpen] = React.useState(false);
    const [displayNone, setDisplayNone] = React.useState(true);
    const wrapperRef = useRef<any>(null);

    const onWrapperClick = (event: any) => {
        if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
            setOpen(false);
            setDisplayNone(true);
        }
    }

    useEffect(() => {
        document.addEventListener("mousedown", onWrapperClick);
        return () => {
            document.removeEventListener("mousedown", onWrapperClick);
        };
    }, [wrapperRef]);

    const findItemText = () => {
        const find = props.items.find((item) => item.value === value);
        return find !== undefined ? find.label : props.items.length > 0 ? props.items[0].label : undefined;
    }

    return (
        <div className={`${styles.wrapperDropMenuDiv} ${props.wrapperClassName}`}>

            {
                props.label !== undefined
                    ?
                    <h1 className={`${styles.wrapperDropMenuTitle} m-0 mb-2`}>{props.label}</h1>
                    : null
            }

            <div ref={wrapperRef} className={`${styles.dropMenuDiv} ${props.className}`}>

                {
                    props.disable !== undefined
                    ?
                    <DisableBlock open={props.disable} />
                    : null
                }

                <div
                    className={styles.dropMenuButton}
                    onClick={() => {
                        setOpen((value) => !value);
                        setDisplayNone((value) => !value);
                    }}
                >
                    <h1 className={styles.dropMenuButtonText}>
                        {
                            findItemText() !== undefined ? findItemText() : ""
                        }
                    </h1>
                    <IoChevronDownOutline className={styles.arrowImg} style={displayNone ? { transform: "rotate(0deg)" } : { transform: "rotate(90deg)" }} />
                </div>
                <div className={styles.menu} style={open ? { background: "#262626" } : displayNone ? { display: "none" } : {}}>
                    <Trail open={open}>
                        {
                            props.items.map((item) => (
                                <div
                                    className={styles.item}
                                    key={uuidV4()}
                                    onClick={() => {
                                        setOpen(false);
                                        setDisplayNone(true);
                                        setValue(item.value);
                                        if(props.onChange !== undefined) props.onChange(item.value);
                                    }}>
                                    <h1>{item.label}</h1>
                                </div>
                            ))
                        }
                    </Trail>
                </div>
            </div>
        </div>
    )
}