import styles from "./LauncherLayout.module.scss";
import { ReactNode, useEffect, useState } from "react";
import { v4 as uuidV4 } from "uuid";
import { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import ApiService from "../../../utils/ApiService";
import { setLauncherAssets } from "../../../store/slices/launcherAssetsSlice";
import { ILauncherAssetServer } from "../../../interfaces/ILauncherAssets";
import DropMenu from "../../dropMenu/DropMenu";
import { Button, Spinner } from "react-bootstrap";
import ModalCustomize from "../../modalCustomize/ModalCustomize";

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

    const [releaseModalCustomizeState, setReleaseModalCustomizeState] = useState<boolean>(false);
    const [releaseModalCustomizeSelectServer, setReleaseModalCustomizeSelectServer] = useState<string>(serverId);
    const [releaseModalCustomizeSelectServerData, setReleaseModalCustomizeSelectServerData] = useState<ILauncherAssetServer>();

    useEffect(() => {
        const newReleaseModalCustomizeSelectServerData = launcherAssetServers.find((server) => server.id === releaseModalCustomizeSelectServer);
        if (newReleaseModalCustomizeSelectServerData === undefined) return;
        setReleaseModalCustomizeSelectServerData(newReleaseModalCustomizeSelectServerData);
    }, [releaseModalCustomizeSelectServer, releaseModalCustomizeState]);

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
        if (selectServer === undefined) return; // TODO
        router.push(`/launcher/assets/${selectServer}${router.pathname.split("[id]")[1]}`);
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

    if (launcherAssetServers.length <= 0) {
        return (
            <div className="row justify-content-center align-items-center align-content-center" style={{ height: "100vh" }}>
                <Spinner animation="border" role="status" variant="primary">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

    return (
        <>

            <ModalCustomize state={releaseModalCustomizeState}>

                <div className={styles.modalCustomizeTitleDiv}>
                    <div className={styles.modalCustomizeTitleDiv_l}>
                        <DropMenu
                            className={styles.selectServerDropMenu}
                            value={releaseModalCustomizeSelectServer}
                            onChange={setReleaseModalCustomizeSelectServer}
                            items={selectServerDropMenuItem(launcherAssetServers)}
                        />
                    </div>
                    <div className={styles.modalCustomizeTitleDiv_r}>
                        <Button className="me-2" variant="danger" onClick={() => setReleaseModalCustomizeState(false)}>取消</Button>
                        <Button variant="primary">確認發布</Button>
                    </div>
                </div>

                <hr />

                <div className={styles.releaseModalCustomizeContainer}>

                    <div className={styles.releaseModalCustomizeContainerLeft}>

                        <h1 className={`${styles.releaseModalCustomizeTitle} m-0 mb-2`}>
                            伺服器Id:
                            <span className={`${styles.releaseModalCustomizeTitleValue}`}>{releaseModalCustomizeSelectServerData?.id}</span>
                        </h1>

                        <h1 className={`${styles.releaseModalCustomizeTitle} m-0 mb-2`}>
                            名稱:
                            <span className={`${styles.releaseModalCustomizeTitleValue}`}>{releaseModalCustomizeSelectServerData?.name}</span>
                        </h1>

                        <h1 className={`${styles.releaseModalCustomizeTitle} m-0 mb-2`}>
                            進入規則:
                            <span className={`${styles.releaseModalCustomizeTitleValue}`}>{releaseModalCustomizeSelectServerData?.action.type.toUpperCase()}</span>
                        </h1>

                        <h1 className={`${styles.releaseModalCustomizeTitle} m-0 mb-2`}>
                            Minecraft 版本:
                            <span className={`${styles.releaseModalCustomizeTitleValue}`}>{releaseModalCustomizeSelectServerData?.minecraftVersion}</span>
                        </h1>

                        <h1 className={`${styles.releaseModalCustomizeTitle} m-0 mb-2`}>
                            啟動類型:
                            <span className={`${styles.releaseModalCustomizeTitleValue}`}>{releaseModalCustomizeSelectServerData?.minecraftType}</span>
                        </h1>

                        <h1 className={`${styles.releaseModalCustomizeTitle} m-0 mb-2`}>
                            Java 版本(Windows):
                            <span className={`${styles.releaseModalCustomizeTitleValue}`}>{releaseModalCustomizeSelectServerData?.java.windows.version}</span>
                        </h1>

                        <h1 className={`${styles.releaseModalCustomizeTitle} m-0 mb-2`}>
                            Java 版本(OSX):
                            <span className={`${styles.releaseModalCustomizeTitleValue}`}>{releaseModalCustomizeSelectServerData?.java.osx.version}</span>
                        </h1>

                    </div>

                    <div className={styles.releaseModalCustomizeContainerRight}>

                        <h1 className={`${styles.releaseModalCustomizeTitle} m-0 mb-2`}>
                            使用模組包:
                            <span className={`${styles.releaseModalCustomizeTitleValue}`}>{releaseModalCustomizeSelectServerData?.modpack !== null ? "Yse" : "No"}</span>
                        </h1>

                        <h1 className={`${styles.releaseModalCustomizeTitle} m-0 mb-2`}>
                            名稱:
                            <span className={`${styles.releaseModalCustomizeTitleValue}`}>{releaseModalCustomizeSelectServerData?.modpack !== null ? releaseModalCustomizeSelectServerData?.modpack.name : ""}</span>
                        </h1>

                        <h1 className={`${styles.releaseModalCustomizeTitle} m-0 mb-2`}>
                            類型:
                            <span className={`${styles.releaseModalCustomizeTitleValue}`}>{releaseModalCustomizeSelectServerData?.modpack !== null ? releaseModalCustomizeSelectServerData?.modpack.type : ""}</span>
                        </h1>

                        <h1 className={`${styles.releaseModalCustomizeTitle} m-0 mb-2`}>
                            版本:
                            <span className={`${styles.releaseModalCustomizeTitleValue}`}>{releaseModalCustomizeSelectServerData?.modpack !== null ? releaseModalCustomizeSelectServerData?.modpack.version : ""}</span>
                        </h1>

                        <h1 className={`${styles.releaseModalCustomizeTitle} m-0 mb-2`}>
                            Project ID:
                            <span className={`${styles.releaseModalCustomizeTitleValue}`}>{releaseModalCustomizeSelectServerData?.modpack !== null ? releaseModalCustomizeSelectServerData?.modpack.projectId : ""}</span>
                        </h1>

                        <h1 className={`${styles.releaseModalCustomizeTitle} m-0 mb-2`}>
                            File ID:
                            <span className={`${styles.releaseModalCustomizeTitleValue}`}>{releaseModalCustomizeSelectServerData?.modpack !== null ? releaseModalCustomizeSelectServerData?.modpack.fileId : ""}</span>
                        </h1>

                        <h1 className={`${styles.releaseModalCustomizeTitle} m-0 mb-2`}>
                            第三方下載位置:
                            <span className={`${styles.releaseModalCustomizeTitleValue}`}>{releaseModalCustomizeSelectServerData?.modpack !== null ? releaseModalCustomizeSelectServerData?.modpack.downloadUrl : ""}</span>
                        </h1>

                    </div>

                </div>

                <hr />

                <div className={styles.releaseModalCustomizeContainer}>

                    <div className={styles.releaseModalCustomizeContainerLeft}>

                        <h1 className={`${styles.releaseModalCustomizeTitle} m-0 mb-2`}>
                            使用自定模組載入器:
                            <span className={`${styles.releaseModalCustomizeTitleValue}`}>{releaseModalCustomizeSelectServerData?.modLoader !== null ? "Yse" : "No"}</span>
                        </h1>

                        <h1 className={`${styles.releaseModalCustomizeTitle} m-0 mb-2`}>
                            模組載入器類型:
                            <span className={`${styles.releaseModalCustomizeTitleValue}`}>{releaseModalCustomizeSelectServerData?.modLoader !== null ? releaseModalCustomizeSelectServerData?.modLoader.type : ""}</span>
                        </h1>

                        <h1 className={`${styles.releaseModalCustomizeTitle} m-0 mb-2`}>
                            模組載入器版本:
                            <span className={`${styles.releaseModalCustomizeTitleValue}`}>{releaseModalCustomizeSelectServerData?.modLoader !== null ? releaseModalCustomizeSelectServerData?.modLoader.version : ""}</span>
                        </h1>

                    </div>

                    <div className={styles.releaseModalCustomizeContainerRight}>

                        <h1 className={`${styles.releaseModalCustomizeTitle} m-0 mb-2`}>
                            額外模組規則:
                            <span className={`${styles.releaseModalCustomizeTitleValue}`}>{releaseModalCustomizeSelectServerData?.modules.length} 個規則</span>
                        </h1>

                    </div>

                </div>

            </ModalCustomize>

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

                        <Button className={styles.releaseButton} variant="success" onClick={() => setReleaseModalCustomizeState(true)}>發布</Button>

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
    );
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
        rootLink: "/launcher/assets",
        linkTo: "/general"
    },
    {
        id: INavbarType.MODPACK,
        title: "模組包",
        rootLink: "/launcher/assets",
        linkTo: "/modpack"
    },
    {
        id: INavbarType.LOADER,
        title: "模組加載器",
        rootLink: "/launcher/assets",
        linkTo: "/loader"
    },
    {
        id: INavbarType.MODULE,
        title: "模組",
        rootLink: "/launcher/assets",
        linkTo: "/module"
    },
    {
        id: INavbarType.JAVA,
        title: "Java",
        rootLink: "/launcher/assets",
        linkTo: "/java"
    }
]

function selectServerDropMenuItem(servers: Array<ILauncherAssetServer>): Array<{ label: string, value: string }> {
    const newServers = new Array<{ label: string, value: string }>();
    for (let server of servers) {
        newServers.push({
            label: server.name !== undefined && server.name.length > 0 ? server.name : server.id,
            value: server.id
        });
    }
    return newServers;
}