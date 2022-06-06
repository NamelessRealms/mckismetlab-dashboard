import { useRouter } from "next/router";
import { ReactElement, useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import DropMenu from "../../../../../components/dropMenu/DropMenu";
import LauncherLayout from "../../../../../components/layout/launcherLayout/LauncherLayout";
import PanelLayout from "../../../../../components/layout/panelLayout/PanelLayout";
import ModalChangeSave from "../../../../../components/modalChangeSave/ModalChangeSave";
import { ILauncherAssetServerJava, ILauncherAssetServeSystemJavaType } from "../../../../../interfaces/ILauncherAssets";
import { useAppDispatch, useAppSelector } from "../../../../../store/hooks";
import { setServer } from "../../../../../store/slices/launcherAssetsSlice";
import Utils from "../../../../../utils/Utils";
import styles from "./Java.module.scss";

export default function LauncherAssetsJava() {

    const router = useRouter();
    const serverId = router.query.id as string;
    const launcherAssetServer = useAppSelector((state) => state.launcherAssets.servers).find((server) => server.id === serverId);
    const dispatch = useAppDispatch();

    const [initialState, setInitialState] = useState(false);
    const [modalChangeSaveState, setModalChangeSaveState] = useState<boolean>(false);
    const [routerChange, setRouterChange] = useState(false);

    const [systemType, setSystemType] = useState<ILauncherAssetServeSystemJavaType>("windows");
    const [javaSystems, setJavaSystems] = useState<ILauncherAssetServerJava | null>(launcherAssetServer !== undefined ? launcherAssetServer.java : null);

    useEffect(() => {
        if (!initialState) setInitialState(true);
    }, []);

    useEffect(() => {
        if (initialState) setRouterChange(true);
        if (launcherAssetServer === undefined || !initialState) return;
        setJavaSystems(launcherAssetServer.java);
    }, [serverId]);

    // * show modal change save
    useEffect(() => {
        if (initialState && !modalChangeSaveState) {
            if (!routerChange) {
                setModalChangeSaveState(true);
            } else {
                setRouterChange(false);
            }
        }
    }, [javaSystems]);

    // * save the new launcher asset server
    const launcherAssetServerSave = () => {
        setModalChangeSaveState(false);
        if(launcherAssetServer !== undefined && javaSystems !== null) {
            const newLauncherAssetServer = Utils.copyObjectArray(launcherAssetServer);
            newLauncherAssetServer.java = javaSystems;
            dispatch(setServer({ id: serverId, data: newLauncherAssetServer }));
        }
    }

    return (
        <div className={styles.launcherAssetsJava}>

            <ModalChangeSave state={modalChangeSaveState} onClickCancel={() => setModalChangeSaveState(false)} onClickConfirm={launcherAssetServerSave} />

            <div className={styles.container}>

                <h1 className={`${styles.launcherAssetsTitle} m-0`}>Java</h1>
                <h2 className={`${styles.launcherAssetsDescriptionText} m-0 mt-2`}>啟動器 Java 設定</h2>

                <div className={styles.block_1}>

                    <div className={`${styles.blockTitleDiv} mb-3`}>
                        <h1 className={`${styles.blockTitle} m-0`}>Java</h1>
                        <DropMenu<ILauncherAssetServeSystemJavaType>
                            className={`${styles.block_1_systemDropMenu}`}
                            value={"windows"}
                            onChange={setSystemType}
                            items={[
                                {
                                    label: "Windows",
                                    value: "windows"
                                },
                                {
                                    label: "OSX",
                                    value: "osx"
                                }
                            ]}
                        />
                    </div>

                    <hr />

                    <div className={`${styles.block_1_1} mb-3`}>

                        <Form.Group className="me-3" style={{ width: "100%" }}>
                            <Form.Label>版本</Form.Label>
                            <Form.Control
                                size="lg"
                                type="text"
                                value={javaSystems !== null ? javaSystems[systemType].version : ""}
                                onChange={(event) => setJavaSystems((oldValue) => {
                                    if(oldValue !== null) {
                                        const newValue = JSON.parse(JSON.stringify(oldValue));
                                        newValue[systemType].version = event.target.value;
                                        return newValue;
                                    }
                                    return oldValue;
                                })}
                            />
                        </Form.Group>

                        <Form.Group style={{ width: "100%" }}>
                            <Form.Label>下載名稱</Form.Label>
                            <Form.Control
                                size="lg"
                                type="text"
                                value={javaSystems !== null ? javaSystems[systemType].download.fileName : ""}
                                onChange={(event) => setJavaSystems((oldValue) => {
                                    if(oldValue !== null) {
                                        const newValue = JSON.parse(JSON.stringify(oldValue));
                                        newValue[systemType].download.fileName = event.target.value;
                                        return newValue;
                                    }
                                    return oldValue;
                                })}
                            />
                        </Form.Group>

                    </div>

                    <Form.Group className="mb-3">
                        <Form.Label>下載網址</Form.Label>
                        <Form.Control
                            size="lg"
                            type="text"
                            value={javaSystems !== null ? javaSystems[systemType].download.url : ""}
                            onChange={(event) => setJavaSystems((oldValue) => {
                                if(oldValue !== null) {
                                    const newValue = JSON.parse(JSON.stringify(oldValue));
                                    newValue[systemType].download.url = event.target.value;
                                    return newValue;
                                }
                                return oldValue;
                            })}
                        />
                    </Form.Group>

                </div>

            </div>

        </div>
    )
}

LauncherAssetsJava.getLayout = (page: ReactElement) => {
    return (
        <PanelLayout>
            <LauncherLayout>{page}</LauncherLayout>
        </PanelLayout>
    );
}

LauncherAssetsJava.requireAuth = true;