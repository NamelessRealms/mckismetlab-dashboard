import styles from "./PanelLayout.module.scss";
import Image from "next/image";
import mckismetlabLogoTitleImg from "../../../assets/images/logo/mckismetlab-title.png";
import { ReactNode, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { v4 as uuidV4 } from "uuid";

interface IProps {
    children: ReactNode;
}

export default function PanelLayout(props: IProps) {

    const router = useRouter();
    const { data: session } = useSession();
    const [secretMenu, setSecretMenu] = useState<IMenusType>();

    useEffect(() => {

        // TODO:
        const routeChangeComplete = (pathname: string) => {
            const pathnameSplit = pathname.split("/")[3];
            setSecretMenu(getIMenusType(pathnameSplit));
        }

        router.events.on("routeChangeComplete", routeChangeComplete);

        return () => {
            router.events.off("routeChangeComplete", routeChangeComplete);
        }
    }, []);

    const onMenuClick = (id: IMenusType, linkTo: string) => {
        // setSecretMenu(id);
        router.push(linkTo);
    }

    return (
        <div className={`${styles.panelLayout} row m-0 p-0`}>

            <div className={`${styles.leftPanelLayout} col-2 m-0 pt-2 px-4`}>

                <div className={`${styles.logoTitleImg}`}>
                    <Image
                        src={mckismetlabLogoTitleImg}
                        alt="Logo Title"
                        onClick={() => router.push("/")}
                    />
                </div>

                <div className={styles.menus}>
                    {
                        menus.map((menu) => (
                            <AuthGuard
                                key={uuidV4()}
                                isAdmin={session?.isAdmin}
                                requireAuth={menu.requireAuth}
                            >
                                <div className={styles.menu}>
                                    <h1 className={`${styles.title} mb-3`}>{menu.title}</h1>
                                    {
                                        menu.childrenMenus.map((childrenMenu) => (
                                            <AuthGuard
                                                key={uuidV4()}
                                                isAdmin={session?.isAdmin}
                                                requireAuth={childrenMenu.requireAuth}
                                            >
                                                <div
                                                    className={`${styles.childrenMenu} ${secretMenu === childrenMenu.id ? styles.childrenMenuHover : ""}`}
                                                    onClick={() => onMenuClick(childrenMenu.id, childrenMenu.linkTo)}
                                                >
                                                    <h2 className={`${styles.childrenTitle} m-0`}>{childrenMenu.title}</h2>
                                                </div>
                                            </AuthGuard>
                                        ))
                                    }
                                </div>
                            </AuthGuard>
                        ))
                    }
                </div>

            </div>

            <div className={`${styles.rightPanelLayout} col m-0 p-0`}>

                <div className={`${styles.top}`}>
                    <div></div>
                    <div className={`${styles.right}`}>
                        <h5 className={`${styles.username}`}>{session?.user?.name}</h5>
                        <Button className={`${styles.signOutButton}`} variant="primary" onClick={() => signOut({ callbackUrl: "/dashboard/auth/signIn" })}>登出</Button>
                    </div>
                </div>

                <div className={`${styles.main}`}>{props.children}</div>

            </div>

        </div >
    );
}

function AuthGuard(props: { children: ReactNode, isAdmin?: boolean, requireAuth?: boolean }) {
    
    if (!props.requireAuth || (props.requireAuth && props.isAdmin)) {
        return <>{props.children}</>;
    }

    return null;
}

enum IMenusType {
    WHITELIST = "whitelist",
    LAUNCHER_ASSETS = "launcherAssets",
    LAUNCHER_ISSUES = "launcherIssues"
}

interface IMenus {
    title: string;
    requireAuth?: boolean;
    childrenMenus: Array<{
        id: IMenusType;
        title: string;
        linkTo: string;
        requireAuth?: boolean;
    }>
}

const menus: Array<IMenus> = [
    {
        title: "伺服器管理",
        requireAuth: true,
        childrenMenus: [
            {
                id: IMenusType.WHITELIST,
                title: "白名單",
                linkTo: "/server/whitelist"
            }
        ]
    },
    {
        title: "啟動器",
        requireAuth: true,
        childrenMenus: [
            {
                id: IMenusType.LAUNCHER_ASSETS,
                title: "伺服器",
                linkTo: "/launcher/assets"
            },
            {
                id: IMenusType.LAUNCHER_ISSUES,
                title: "問題回報",
                linkTo: "/launcher/issues"
            }
        ]
    }
]

function getIMenusType(id: string): IMenusType {
    switch (id) {
        case "whitelist":
            return IMenusType.WHITELIST;
        case "assets":
            return IMenusType.LAUNCHER_ASSETS;
        case "issues":
            return IMenusType.LAUNCHER_ISSUES;
        default:
            return IMenusType.WHITELIST;
    }
}