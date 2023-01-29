import styles from "./DashboardLayout.module.scss";
import Image from "next/image";
import mckismetlabLogoTitleImg from "../../../assets/images/logo/mckismetlab-title.png";
import { ReactNode, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { v4 as uuidV4 } from "uuid";
import Head from "next/head";

interface IProps {
    children: ReactNode;
}

export default function DashboardLayout(props: IProps) {

    const router = useRouter();
    const { data: session } = useSession();
    const localSecretMenu = localStorage.getItem("DashboardLayoutMenu");
    const [secretMenu, setSecretMenu] = useState<IMenusType>(localSecretMenu !== null ? localSecretMenu as IMenusType : "dashboard");

    // useEffect(() => {

    //     // TODO:
    //     const routeChangeComplete = (pathname: string) => {
    //         const pathnameSplit = pathname.split("/")[3];
    //         setSecretMenu(pathnameSplit as IMenusType);
    //     }

    //     router.events.on("routeChangeComplete", routeChangeComplete);

    //     return () => {
    //         router.events.off("routeChangeComplete", routeChangeComplete);
    //     }

    // }, []);

    const onMenuClick = (id: IMenusType, linkTo: string) => {

        localStorage.setItem("DashboardLayoutMenu", id);

        if(id === "whitelist") {
            localStorage.removeItem("localServerMangeWhitelistLayoutNavbar");
        }

        setSecretMenu(id);
        router.push(linkTo);
    }

    return (
        <>

            <Head>
                <title>mcKismetLab Dashboard</title>
            </Head>

            <div className={`${styles.panelLayout} row m-0 p-0`}>

                <div className={`${styles.leftPanelLayout} col-2 m-0`}>

                    <div className={`${styles.logoTitleImg}`}>
                        <Image
                            src={mckismetlabLogoTitleImg}
                            alt="Logo Title"
                            onClick={() => {
                                localStorage.removeItem("DashboardLayoutMenu");
                                setSecretMenu("dashboard");
                                router.push("/");
                            }}
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
                                        {
                                            menu.id !== undefined
                                                ?
                                                <div
                                                    className={`${styles.menuTitleDiv} ${secretMenu === menu.id ? styles.menuTitleDivHover : ""}`}
                                                    onClick={() => onMenuClick(menu.id as IMenusType, menu.linkTo as string)}
                                                >
                                                    <h1 className={`${styles.menuTitle} m-0`}>{menu.title}</h1>
                                                </div>
                                                :
                                                <>
                                                    <h1 className={`${styles.title} mb-3`}>{menu.title}</h1>
                                                    {
                                                        menu.childrenMenus?.map((childrenMenu) => (
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
                                                </>
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
        </>
    );
}

function AuthGuard(props: { children: ReactNode, isAdmin?: boolean, requireAuth?: boolean }) {

    if (!props.requireAuth || (props.requireAuth && props.isAdmin)) {
        return <>{props.children}</>;
    }

    return null;
}

type IMenusType = "whitelist" | "launcherAssets" | "launcherIssues" | "dashboard";

interface IMenus {
    title: string;
    id?: IMenusType;
    requireAuth?: boolean;
    linkTo?: string;
    childrenMenus?: Array<{
        id: IMenusType;
        title: string;
        linkTo: string;
        requireAuth?: boolean;
    }>
}

const menus: Array<IMenus> = [
    {
        id: "dashboard",
        title: "儀表板",
        requireAuth: true,
        linkTo: "/"
    },
    {
        title: "伺服器管理",
        requireAuth: true,
        childrenMenus: [
            {
                id: "whitelist",
                title: "白名單",
                linkTo: "/serverManage/mckismetlab-main-server/whitelist"
            }
        ]
    },
    {
        title: "啟動器",
        requireAuth: true,
        childrenMenus: [
            {
                id: "launcherAssets",
                title: "伺服器",
                linkTo: "/launcher/assets"
            },
            {
                id: "launcherIssues",
                title: "問題回報",
                linkTo: "/launcher/issues"
            }
        ]
    }
]