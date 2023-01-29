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
import kyIntercept from "../../../utils/KyIntercept";

interface IProps {
    children: ReactNode;
}

export default function LauncherLayout(props: IProps) {

    const router = useRouter();
    const serverId = router.query.id as string;
    const dispatch = useAppDispatch();
    const launcherAssets = useAppSelector((state) => state.launcherAssets);
    const launcherAssetServer = launcherAssets.servers;
    const localLauncherLayoutNavbar = localStorage.getItem("LauncherLayoutNavbar");
    const [secretNavbar, setSecretNavbar] = useState<INavbarType>(localLauncherLayoutNavbar !== null ? localLauncherLayoutNavbar as INavbarType : "general");
    const [selectServer, setSelectServer] = useState<string>(serverId);

    const [releaseModalCustomizeState, setReleaseModalCustomizeState] = useState<boolean>(false);
    const [releaseModalCustomizeSelectServer, setReleaseModalCustomizeSelectServer] = useState<string>(serverId);
    const [releaseModalCustomizeSelectServerData, setReleaseModalCustomizeSelectServerData] = useState<ILauncherAssetServer>();
    const [updateLauncherAssetsDataState, setUpdateLauncherAssetsDataState] = useState<"OK" | "ERROR" | "LOADING" | "EDIT">("EDIT");

    useEffect(() => {
        const newReleaseModalCustomizeSelectServerData = launcherAssetServer.find((server) => server.id === releaseModalCustomizeSelectServer);
        if (newReleaseModalCustomizeSelectServerData === undefined) return;
        setReleaseModalCustomizeSelectServerData(newReleaseModalCustomizeSelectServerData);
    }, [releaseModalCustomizeSelectServer, releaseModalCustomizeState]);

    // useEffect(() => {

    //     // TODO
    //     const routeChangeComplete = (pathname: string) => {
    //         const pathnameSplit = pathname.split("/")[5];
    //         setSecretNavbar(getINavbarType(pathnameSplit));
    //     }

    //     router.events.on("routeChangeComplete", routeChangeComplete);

    //     return () => {
    //         router.events.off("routeChangeComplete", routeChangeComplete);
    //     }
    // }, []);

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
        if (launcherAssetServer.length > 0) return;
        getApiLauncherAssetServer();
    }, []);

    const onNavbarClick = (id: INavbarType, rootLink: string, linkTo: string) => {
        localStorage.setItem("LauncherLayoutNavbar", id);
        setSecretNavbar(id);
        router.push(`${rootLink}/${serverId}${linkTo}`);
    }

    const release = async () => {

        setUpdateLauncherAssetsDataState("LOADING");

        const releaseLauncherResponse = await kyIntercept(`${ApiService.apiServerUrl}/launcher/v2/assets`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            json: launcherAssets
        });

        if (releaseLauncherResponse !== null && releaseLauncherResponse.status === 201) {
            setUpdateLauncherAssetsDataState("OK");
        } else {
            setUpdateLauncherAssetsDataState("ERROR");
        }
    }

    if (launcherAssetServer.length <= 0) {
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

                {
                    updateLauncherAssetsDataState !== "EDIT"
                        ?
                        <div className="row justify-content-center align-items-center align-content-center">
                            {
                                updateLauncherAssetsDataState !== "OK"
                                    ?
                                    <Spinner animation="border" role="status" variant="primary">
                                        <span className="visually-hidden">Loading...</span>
                                    </Spinner>
                                    :
                                    null
                            }
                            <h1 className={`m-0 mt-4 mb-2`} style={{ color: "#fff", fontSize: "28px", textAlign: "center" }}>
                                {
                                    updateLauncherAssetsDataState === "LOADING"
                                        ?
                                        "上傳中"
                                        :
                                        updateLauncherAssetsDataState === "ERROR"
                                            ?
                                            "上傳失敗"
                                            :
                                            updateLauncherAssetsDataState === "OK"
                                                ?
                                                <div style={{ display: "flex", flexDirection: "column" }}>
                                                    <span className="mb-4 mx-4">上傳成功</span>
                                                    <Button
                                                        className="mb-2"
                                                        variant="primary"
                                                        onClick={() => {
                                                            setReleaseModalCustomizeState(false);
                                                            setUpdateLauncherAssetsDataState("EDIT");
                                                        }}
                                                    >完成退出</Button>
                                                </div>
                                                :
                                                null
                                }
                            </h1>
                        </div>
                        :
                        <>
                            <div className={styles.modalCustomizeTitleDiv}>
                                <div className={styles.modalCustomizeTitleDiv_l}>
                                    <DropMenu
                                        className={styles.selectServerDropMenu}
                                        value={releaseModalCustomizeSelectServer}
                                        onChange={setReleaseModalCustomizeSelectServer}
                                        items={selectServerDropMenuItem(launcherAssetServer)}
                                    />
                                </div>
                                <div className={styles.modalCustomizeTitleDiv_r}>
                                    <Button className="me-2 ms-5" variant="danger" onClick={() => setReleaseModalCustomizeState(false)}>取消</Button>
                                    <Button variant="primary" onClick={release}>確認發布</Button>
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
                        </>
                }

            </ModalCustomize>

            <div className={styles.launcherLayout}>
                <div className={`${styles.navbar}`}>

                    <div className={`${styles.navbarLeft}`}>
                        {
                            navbar.map((nav) => (
                                <div
                                    className={`${styles.link} ${nav.id === secretNavbar ? styles.linkHover : ""}`}
                                    key={uuidV4()}
                                    onClick={() => onNavbarClick(nav.id, nav.rootLink, nav.linkTo)}
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
                            items={selectServerDropMenuItem(launcherAssetServer)}
                        />

                    </div>

                </div>
            </div>

            {props.children}
        </>
    );
}

type INavbarType = "general" | "modpack" | "loader" | "module" | "java";

interface INavbar {
    id: INavbarType;
    title: string;
    rootLink: string;
    linkTo: string;
}

const navbar: Array<INavbar> = [
    {
        id: "general",
        title: "一般",
        rootLink: "/launcher/assets",
        linkTo: "/general"
    },
    {
        id: "modpack",
        title: "模組包",
        rootLink: "/launcher/assets",
        linkTo: "/modpack"
    },
    {
        id: "loader",
        title: "模組加載器",
        rootLink: "/launcher/assets",
        linkTo: "/loader"
    },
    {
        id: "module",
        title: "模組",
        rootLink: "/launcher/assets",
        linkTo: "/module"
    },
    {
        id: "java",
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