import { ReactNode, useState } from "react";
import { IoChevronDownOutline } from "react-icons/io5";
import styles from "./FoldTitle.module.scss";

interface IProps {
    open: boolean;
    title: string;
    description?: string;
    children: ReactNode
    className?: string;
    onClick?: (state: boolean) => void
}

export default function FoldTitle(props: IProps) {

    const [open, setOpen] = useState<boolean>(props.open);

    return (
        <div className={`${styles.foldTitleDiv} ${props.className}`}>

            <div className={styles.foldTitleTitleDiv} onClick={() => {
                setOpen((oldValue) => !oldValue);
                if(props.onClick !== undefined) props.onClick(open);
            }}>
                <h1 className={styles.foldTitleTitle}>{props.title}</h1>
                {props.description !== undefined && open ? <h1 className={styles.foldTitleDescription}>{props.description}</h1> : null}
                <div className={styles.foldTitleArrowImgDiv}>
                    <IoChevronDownOutline className={styles.foldTitleArrowImg} style={open ? { transform: "rotate(0deg)" } : { transform: "rotate(90deg)" }} />
                </div>
            </div>

            {open ? <hr className={styles.foldTitleHr} /> : null}

            <div className={`${styles.foldTitleContainer} ${!open ? styles.foldTitleContainerTopFoldAnimation : styles.foldTitleContainerBottomFoldAnimation}`}>
                {props.children}
            </div>

        </div>
    )
}