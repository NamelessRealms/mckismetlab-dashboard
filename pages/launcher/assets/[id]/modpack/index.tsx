import { useRouter } from "next/router";
import { ReactElement, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../../store/hooks";
import { ILauncherAssetServerModpackType } from "../../../../../interfaces/ILauncherAssets";
import LauncherLayout from "../../../../../components/layout/launcherLayout/LauncherLayout";
import DashboardLayout from "../../../../../components/layout/dashboardLayout/DashboardLayout";
import styles from "./Modpack.module.scss";
import { Form } from "react-bootstrap";
import DropMenu from "../../../../../components/dropMenu/DropMenu";
import ModalChangeSave from "../../../../../components/modalChangeSave/ModalChangeSave";
import { setServer } from "../../../../../store/slices/launcherAssetsSlice";
import Toggle from "../../../../../components/toggle/Toggle";
import DisableBlock from "../../../../../components/disableBlock/DisableBlock";
import Utils from "../../../../../utils/Utils";

enum IModpackType {
    CURSE_FORGE = "CurseForge",
    FTB = "FTB",
    REVISE = "Revise"
}

export default function LauncherAssetsModpack() {

    const router = useRouter();
    const serverId = router.query.id as string;
    const launcherAssetServer = useAppSelector((state) => state.launcherAssets.servers).find((server) => server.id === serverId);
    const dispatch = useAppDispatch();

    const [initialState, setInitialState] = useState(false);
    const [modalChangeSaveState, setModalChangeSaveState] = useState<boolean>(false);
    const [routerChange, setRouterChange] = useState(false);

    const [toggle, setToggle] = useState<boolean>(launcherAssetServer !== undefined ? launcherAssetServer.modpack !== null : false);
    const [name, setName] = useState<string>(launcherAssetServer !== undefined ? launcherAssetServer.modpack !== null ? launcherAssetServer.modpack.name : "" : "");
    const [imageUrl, setImageUrl] = useState<string | null>(launcherAssetServer !== undefined ? launcherAssetServer.modpack !== null ? launcherAssetServer.modpack.imageUrl : null : null);
    const [type, setType] = useState<ILauncherAssetServerModpackType>(launcherAssetServer !== undefined ? launcherAssetServer.modpack !== null ? launcherAssetServer.modpack.type : "CurseForge" : "CurseForge");
    const [projectId, setProjectId] = useState<number>(launcherAssetServer !== undefined ? launcherAssetServer.modpack !== null ? launcherAssetServer.modpack.projectId : 0 : 0);
    const [fileId, setFileId] = useState<number>(launcherAssetServer !== undefined ? launcherAssetServer.modpack !== null ? launcherAssetServer.modpack.fileId : 0 : 0);
    const [version, setVersion] = useState<string>(launcherAssetServer !== undefined ? launcherAssetServer.modpack !== null ? launcherAssetServer.modpack.version : "" : "");
    const [downloadUrl, setDownloadUrl] = useState<string>(launcherAssetServer !== undefined ? launcherAssetServer.modpack !== null ? launcherAssetServer.modpack.downloadUrl : "" : "");
    const [linkUrl, setLinkUrl] = useState<string>(launcherAssetServer !== undefined ? launcherAssetServer.modpack !== null ? launcherAssetServer.modpack.linkUrl : "" : "");

    useEffect(() => {
        if (!initialState) setInitialState(true);
    }, []);

    useEffect(() => {
        if (initialState) setRouterChange(true);
        if (launcherAssetServer === undefined || !initialState) return;
        if (launcherAssetServer.modpack !== null) {
            setName(launcherAssetServer.modpack.name);
            setImageUrl(launcherAssetServer.modpack.imageUrl);
            setType(launcherAssetServer.modpack.type);
            setProjectId(launcherAssetServer.modpack.projectId);
            setFileId(launcherAssetServer.modpack.fileId);
            setVersion(launcherAssetServer.modpack.version);
            setDownloadUrl(launcherAssetServer.modpack.downloadUrl);
            setLinkUrl(launcherAssetServer.modpack.linkUrl);
        } else {
            setRouterChange(false);
        }
    }, [serverId]);

    useEffect(() => {
        if (initialState && !modalChangeSaveState) {
            if (!routerChange) {
                setModalChangeSaveState(true);
            } else {
                setRouterChange(false);
            }
        }
    }, [name, imageUrl, type, projectId, fileId, version, downloadUrl, linkUrl, toggle]);

    if (launcherAssetServer === undefined) {
        return <></>;
    }

    // * save the new launcher asset server
    const launcherAssetServerSave = () => {
        setModalChangeSaveState(false);

        const newLauncherAssetServer = Object.assign({}, launcherAssetServer);

        if(toggle) {
            newLauncherAssetServer.modpack = {
                name,
                imageUrl: imageUrl !== null ? imageUrl : "",
                type,
                projectId,
                fileId,
                version,
                downloadUrl,
                linkUrl
            }
        } else {
            newLauncherAssetServer.modpack = null;
        }

        newLauncherAssetServer.minecraftType = Utils.getRunMinecraftType(newLauncherAssetServer);

        dispatch(setServer({
            id: serverId,
            data: newLauncherAssetServer
        }));
    }

    return (
        <div className={styles.launcherAssetsModpack}>

            <ModalChangeSave state={modalChangeSaveState} onClickCancel={() => setModalChangeSaveState(false)} onClickConfirm={launcherAssetServerSave} />

            <div className={styles.container}>

                <h1 className={`${styles.launcherAssetsModpackTitle} m-0`}>模組包</h1>
                <h2 className={`${styles.launcherAssetsModpackDescriptionText} m-0 mt-2`}>啟動器模組包設定</h2>

                <div className={styles.launcherAssetsModpackDescriptionBlock}>

                    <div className={`${styles.blockTitleDiv} mb-3`}>
                        <h1 className={`${styles.blockTitle}`}>模組包</h1>
                        <Toggle className={styles.blockTitleDivToggle} state={toggle} onChange={setToggle} />
                    </div>

                    <hr />

                    <div className={styles.containerBlock}>

                        <DisableBlock open={!toggle} />

                        <div className={`${styles.serverDescriptionTop}`}>

                            <div className={`${styles.sdt_l}`}>
                                <div className={`${styles.serverImg}`}>
                                    {
                                        imageUrl !== null && imageUrl !== undefined && imageUrl.length > 0
                                            ?
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                className={styles.modpackImg}
                                                src={imageUrl}
                                                alt="Modpack Image Url"
                                            />
                                            :
                                            launcherAssetServer.modpack !== null && imageUrl !== null && imageUrl.length > 0
                                                ?
                                                <h1 className={`${styles.serverImgText} m-0`}>{`${name.slice(0, 1)}-${name.split("").pop()}`}</h1>
                                                :
                                                <h1 className={`${styles.serverImgText} m-0`}>無</h1>
                                    }
                                </div>
                            </div>

                            <div className={`${styles.sdt_r}`}>
                                <Form.Group className="mb-3">
                                    <Form.Label>模組包名稱</Form.Label>
                                    <Form.Control size="lg" type="text" value={name} onChange={(event) => setName(event.target.value)} />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>模組包圖片網址</Form.Label>
                                    <Form.Control size="lg" type="text" placeholder="https://" value={imageUrl !== null && imageUrl !== undefined ? imageUrl : ""} onChange={(event) => setImageUrl(event.target.value.length > 0 ? event.target.value : null)} />
                                </Form.Group>
                            </div>

                        </div>

                        <hr />

                        <div className={`${styles.serverDescriptionBottom}`}>

                            <div className={`${styles.serverDescriptionBottomBlock_01} mb-3`}>

                                <DropMenu
                                    className={`${styles.serverDescriptionBottomBlock_01_dropMenu}`}
                                    label="模組包取得方式"
                                    value={type !== null ? type : IModpackType.CURSE_FORGE}
                                    onChange={setType}
                                    items={[
                                        {
                                            label: "CurseForge",
                                            value: IModpackType.CURSE_FORGE
                                        },
                                        {
                                            label: "FTB",
                                            value: IModpackType.FTB
                                        },
                                        {
                                            label: "自製模組包",
                                            value: IModpackType.REVISE
                                        }
                                    ]}
                                />

                                <Form.Group className="mx-3" style={{ width: "200px" }}>
                                    <Form.Label>Project ID</Form.Label>
                                    <Form.Control size="lg" type="number" value={projectId} onChange={(event) => setProjectId(Number(event.target.value))} />
                                </Form.Group>

                                <Form.Group className="me-3" style={{ width: "200px" }}>
                                    <Form.Label>File ID</Form.Label>
                                    <Form.Control size="lg" type="number" value={fileId} onChange={(event) => setFileId(Number(event.target.value))} />
                                </Form.Group>

                                <Form.Group className="me-3" style={{ width: "400px" }}>
                                    <Form.Label>模組包版本</Form.Label>
                                    <Form.Control size="lg" type="text" value={version} onChange={(event) => setVersion(event.target.value)} />
                                </Form.Group>

                            </div>

                            <hr />

                            <Form.Group className="mb-3">
                                <Form.Label>模組包連結位置</Form.Label>
                                <Form.Control size="lg" type="text" placeholder="https://" value={linkUrl !== undefined ? linkUrl : ""} onChange={(event) => setLinkUrl(event.target.value)} />
                            </Form.Group>
                            <hr />
                            <Form.Group className="mb-3">
                                <Form.Label>模組包第三方下載位置</Form.Label>
                                <Form.Control size="lg" type="text" placeholder="https://" value={downloadUrl} onChange={(event) => setDownloadUrl(event.target.value)} />
                            </Form.Group>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    )
}

LauncherAssetsModpack.getLayout = (page: ReactElement) => {
    return (
        <DashboardLayout>
            <LauncherLayout>{page}</LauncherLayout>
        </DashboardLayout>
    );
}

LauncherAssetsModpack.requireAuth = true;