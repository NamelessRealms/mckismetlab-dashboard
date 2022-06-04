import { ReactElement, useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { ILauncherAssetServerModLoaderType } from "../../../../../../interfaces/ILauncherAssets";
import DropMenu from "../../../../../../components/dropMenu/DropMenu";
import LauncherLayout from "../../../../../../components/layout/launcherLayout/LauncherLayout";
import PanelLayout from "../../../../../../components/layout/panelLayout/PanelLayout";
import Toggle from "../../../../../../components/toggle/Toggle";
import styles from "./Loader.module.scss";
import { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "../../../../../../store/hooks";
import { setServer } from "../../../../../../store/slices/launcherAssetsSlice";
import ModalChangeSave from "../../../../../../components/modalChangeSave/ModalChangeSave";
import DisableBlock from "../../../../../../components/disableBlock/DisableBlock";

export default function LauncherAssetsLoader() {

    const router = useRouter();
    const serverId = router.query.id as string;
    const dispatch = useAppDispatch();
    const launcherAssetServer = useAppSelector((state) => state.launcherAssets.servers).find((server) => server.id === serverId);

    const [initialState, setInitialState] = useState(false);
    const [modalChangeSaveState, setModalChangeSaveState] = useState<boolean>(false);
    const [routerChange, setRouterChange] = useState(false);

    const [toggle, setToggle] = useState<boolean>(launcherAssetServer !== undefined ? launcherAssetServer.modLoader !== null : false);
    const [type, setType] = useState<ILauncherAssetServerModLoaderType>(launcherAssetServer !== undefined ? launcherAssetServer.modLoader !== null ? launcherAssetServer.modLoader.type : "Forge" : "Forge");
    const [version, setVersion] = useState<string>(launcherAssetServer !== undefined ? launcherAssetServer.modLoader !== null ? launcherAssetServer.modLoader.version : "" : "");

    useEffect(() => {
        if (!initialState) setInitialState(true);
    }, []);

    useEffect(() => {
        if (initialState) setRouterChange(true);
        if (launcherAssetServer === undefined || !initialState) return;
        if (launcherAssetServer.modLoader !== null) {
            setType(launcherAssetServer.modLoader.type);
            setVersion(launcherAssetServer.modLoader.version);
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
    }, [type, version, toggle]);

    if (launcherAssetServer === undefined) {
        return <></>;
    }

    // save the new launcher asset server
    const launcherAssetServerSave = () => {
        setModalChangeSaveState(false);

        const newLauncherAssetServer = Object.assign({}, launcherAssetServer);

        if (toggle) {
            newLauncherAssetServer.modLoader = {
                id: "",
                type,
                version,
                download: { url: "" }
            }
        } else {
            newLauncherAssetServer.modLoader = null;
        }

        dispatch(setServer({
            id: serverId,
            data: newLauncherAssetServer
        }));
    }

    return (
        <div className={styles.loader}>

            <ModalChangeSave state={modalChangeSaveState} onClickCancel={() => setModalChangeSaveState(false)} onClickConfirm={launcherAssetServerSave} />

            <div className={styles.container}>

                <h1 className={`${styles.launcherAssetsTitle} m-0`}>模組載入器</h1>
                <h2 className={`${styles.launcherAssetsDescriptionText} m-0 mt-2`}>啟動器模組載入器設定</h2>

                <div className={styles.block_1}>

                    <div className={`${styles.blockTitleDiv} mb-3`}>
                        <h1 className={`${styles.blockTitle} m-0`}>載入器</h1>
                        <Toggle className={styles.blockTitleDivToggle} state={toggle} onChange={setToggle} />
                    </div>

                    <hr />

                    <div className={styles.block_1_container}>

                        <DisableBlock open={!toggle} />

                        <DropMenu<ILauncherAssetServerModLoaderType>
                            className={`${styles.block_1_dropMenu} mb-3`}
                            label="模組載入器"
                            value={type}
                            items={[
                                {
                                    label: "Forge",
                                    value: "Forge"
                                },
                                {
                                    label: "Fabric",
                                    value: "Fabric"
                                }
                            ]}
                        />

                        <Form.Group>
                            <Form.Label>模組載入器版本</Form.Label>
                            <Form.Control size="lg" type="text" />
                        </Form.Group>

                    </div>

                </div>

            </div>

        </div>
    );
}

LauncherAssetsLoader.getLayout = (page: ReactElement) => {
    return (
        <PanelLayout>
            <LauncherLayout>{page}</LauncherLayout>
        </PanelLayout>
    );
}

LauncherAssetsLoader.requireAuth = true;