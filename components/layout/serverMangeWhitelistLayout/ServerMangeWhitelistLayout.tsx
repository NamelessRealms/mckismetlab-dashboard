import { useRouter } from "next/router";
import { ReactNode, useEffect, useState } from "react";
import DropMenu from "../../dropMenu/DropMenu";
import styles from "./ServerMangeWhitelistLayout.module.scss";
import MinecraftServers from "../../../data/minecraft_servers.json";
import { v4 as uuidV4 } from "uuid";

interface IProps {
    children: ReactNode
}

export default function ServerMangeWhitelistLayout(props: IProps) {

    const router = useRouter();
    const serverId = router.query.id as string;

    const localServerMangeWhitelistLayoutNavbar = localStorage.getItem("localServerMangeWhitelistLayoutNavbar");
    const [secretNavbar, setSecretNavbar] = useState<INavbarType>(localServerMangeWhitelistLayoutNavbar !== null ? localServerMangeWhitelistLayoutNavbar as INavbarType : "list");
    const [selectServer, setSelectServer] = useState<string>(serverId);

    const onNavbarClick = (id: INavbarType, linkTo: string) => {
        localStorage.setItem("localServerMangeWhitelistLayoutNavbar", id);
        setSecretNavbar(id);
        router.push(`/serverManage/${serverId}/whitelist${linkTo}`);
    }

    useEffect(() => {
        const routerLinkToPath = router.pathname.split("/serverManage/[id]/whitelist")[1];
        router.push(`/serverManage/${selectServer}/whitelist${routerLinkToPath}`);
    }, [selectServer]);

    // useEffect(() => {

    //      // TODO
    //      const routeChangeComplete = (pathname: string) => {
    //         const pathnameSplit = pathname.split("/")[5];
    //         setSecretNavbar(getNavbarType(pathnameSplit));
    //     }

    //     router.events.on("routeChangeComplete", routeChangeComplete);

    //     return () => {
    //         router.events.off("routeChangeComplete", routeChangeComplete);
    //     }

    // }, []);

    return (
        <>

            <div className={styles.serverMangeWhitelistLayout}>

                <div className={`${styles.navbar}`}>

                    <div className={`${styles.navbarLeft}`}>
                        {
                            navbar.map((nav) => (
                                <div
                                    className={`${styles.link} ${nav.id === secretNavbar ? styles.linkHover : ""}`}
                                    key={uuidV4()}
                                    onClick={() => onNavbarClick(nav.id, nav.linkTo)}
                                >
                                    <h1 className={`${styles.linkText} m-0`}>{nav.title}</h1>
                                </div>
                            ))
                        }
                    </div>

                    <div className={`${styles.navbarRight}`}>

                        <DropMenu
                            className={styles.selectServerDropMenu}
                            value={selectServer}
                            onChange={setSelectServer}
                            items={getMinecraftServersDropMenuItems(MinecraftServers)}
                        />

                    </div>

                </div>

            </div>

            {props.children}

        </>
    )
}

function getMinecraftServersDropMenuItems(servers: Array<{ id: string; name: string }>) {
    const array = new Array<{ label: string; value: string }>();
    for (let server of servers) array.push({ label: server.name, value: server.id });
    return array;
}

type INavbarType = "list" | "clear";

interface INavbar {
    id: INavbarType;
    title: string;
    linkTo: string;
}

const navbar: Array<INavbar> = [
    {
        id: "list",
        title: "管理",
        linkTo: ""
    },
    {
        id: "clear",
        title: "清除",
        linkTo: "/clear"
    }
]

function getNavbarType(id?: string): INavbarType {
    if (id === undefined) return navbar[0].id;
    return id as INavbarType;
}