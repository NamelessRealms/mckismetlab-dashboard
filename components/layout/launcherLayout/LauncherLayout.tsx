import styles from "./LauncherLayout.module.scss";
import { ReactNode, useEffect, useState } from "react";
import { v4 as uuidV4 } from "uuid";
import { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import ApiService from "../../../utils/ApiService";
import { setLauncherAssets } from "../../../store/slices/launcherAssetsSlice";
import { ILauncherAssetServer } from "../../../interfaces/ILauncherAssets";
import DropMenu from "../../dropMenu/DropMenu";
import { Button } from "react-bootstrap";

interface IProps {
    children: ReactNode;
}

export default function LauncherLayout(props: IProps) {

    const router = useRouter();
    const serverId = router.query.id as string;
    const dispatch = useAppDispatch();
    const launcherAssetServers = useAppSelector((state) => state.launcherAssets.servers);
    const [secretNavbar, setSecretNavbar] = useState<INavbarType>(getINavbarType(router.pathname.split("/")[5]));
    const [selectServer, setSelectServer] = useState<string>(serverId);

    useEffect(() => {

        // TODO
        const routeChangeComplete = (pathname: string) => {
            const pathnameSplit = pathname.split("/")[5];
            setSecretNavbar(getINavbarType(pathnameSplit));
        }

        router.events.on("routeChangeComplete", routeChangeComplete);

        return () => {
            router.events.off("routeChangeComplete", routeChangeComplete);
        }
    }, []);

    useEffect(() => {
        if(selectServer === undefined) return; // TODO
        router.push(`/panel/launcher/assets/${selectServer}${router.pathname.split("[id]")[1]}`);
    }, [selectServer]);

    const getApiLauncherAssetServer = async () => {
        const launcherAsset = await ApiService.getLauncherAssets();
        if (launcherAsset === null) return;
        dispatch(setLauncherAssets(launcherAsset));
    }

    useEffect(() => {
        if (launcherAssetServers.length > 0) return;
        getApiLauncherAssetServer();
    }, []);

    const onNavbarClick = (rootLink: string, linkTo: string) => {
        // setSecretNavbar(id);
        router.push(`${rootLink}/${serverId}${linkTo}`);
    }

    return (
        <>

            <div className={styles.launcherLayout}>
                <div className={`${styles.navbar}`}>

                    <div className={`${styles.navbarLeft}`}>
                        {
                            navbar.map((nav) => (
                                <div
                                    className={`${styles.link} ${nav.id === secretNavbar ? styles.linkHover : ""}`}
                                    key={uuidV4()}
                                    onClick={() => onNavbarClick(nav.rootLink, nav.linkTo)}
                                >
                                    <h1 className={`${styles.linkText} m-0`}>{nav.title}</h1>
                                </div>
                            ))
                        }
                    </div>

                    <div className={`${styles.navbarRight}`}>

                        <Button className={styles.releaseButton} variant="success">發布</Button>

                        <DropMenu
                            className={styles.selectServerDropMenu}
                            value={selectServer}
                            onChange={setSelectServer}
                            items={selectServerDropMenuItem(launcherAssetServers)}
                        />

                    </div>

                </div>
            </div>

            {props.children}
        </>
    )
}

function getINavbarType(id: string): INavbarType {
    switch (id) {
        case "java":
            return INavbarType.JAVA;
        case "module":
            return INavbarType.MODULE;
        case "loader":
            return INavbarType.LOADER;
        case "modpack":
            return INavbarType.MODPACK;
        case "general":
        default:
            return INavbarType.GENERAL;

    }
}

enum INavbarType {
    GENERAL = "general",
    MODPACK = "modpack",
    LOADER = "loader",
    MODULE = "module",
    JAVA = "java"
}

interface INavbar {
    id: INavbarType;
    title: string;
    rootLink: string;
    linkTo: string;
}

const navbar: Array<INavbar> = [
    {
        id: INavbarType.GENERAL,
        title: "一般",
        rootLink: "/panel/launcher/assets",
        linkTo: "/general"
    },
    {
        id: INavbarType.MODPACK,
        title: "模組包",
        rootLink: "/panel/launcher/assets",
        linkTo: "/modpack"
    },
    {
        id: INavbarType.LOADER,
        title: "模組加載器",
        rootLink: "/panel/launcher/assets",
        linkTo: "/loader"
    },
    {
        id: INavbarType.MODULE,
        title: "模組",
        rootLink: "/panel/launcher/assets",
        linkTo: "/module"
    },
    {
        id: INavbarType.JAVA,
        title: "Java",
        rootLink: "/panel/launcher/assets",
        linkTo: "/java"
    }
]

function selectServerDropMenuItem(servers: Array<ILauncherAssetServer>): Array<{ label: string, value: string }> {
    const newServers = new Array<{ label: string, value: string }>();
    for(let server of servers) {
        newServers.push({
            label: server.name !== undefined && server.name.length > 0 ? server.name : server.id,
            value: server.id
        });
    }
    return newServers;
}