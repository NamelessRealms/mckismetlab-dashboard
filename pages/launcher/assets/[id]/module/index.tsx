import { useRouter } from "next/router";
import { ReactElement, useEffect, useState } from "react";
import { CgTrash } from "react-icons/cg";
import { v4 as uuidV4 } from "uuid";
import { IoAddSharp } from "react-icons/io5";
import { BiEdit } from "react-icons/bi";
import DisableBlock from "../../../../../components/disableBlock/DisableBlock";
import LauncherLayout from "../../../../../components/layout/launcherLayout/LauncherLayout";
import DashboardLayout from "../../../../../components/layout/dashboardLayout/DashboardLayout";
import { ILauncherAssetServerModule, ILauncherAssetServerModulesAction, ILauncherAssetServerModuleType } from "../../../../../interfaces/ILauncherAssets";
import { useAppDispatch, useAppSelector } from "../../../../../store/hooks";
import styles from "./Module.module.scss";
import ModalCustomize from "../../../../../components/modalCustomize/ModalCustomize";
import { Button, Form, InputGroup } from "react-bootstrap";
import DropMenu from "../../../../../components/dropMenu/DropMenu";
import { setServer } from "../../../../../store/slices/launcherAssetsSlice";
import ModalChangeSave from "../../../../../components/modalChangeSave/ModalChangeSave";
import Utils from "../../../../../utils/Utils";

export default function LauncherAssetsModule() {

    const router = useRouter();
    const serverId = router.query.id as string;
    const launcherAssetServer = useAppSelector((state) => state.launcherAssets.servers).find((server) => server.id === serverId);
    const dispatch = useAppDispatch();

    const [initialState, setInitialState] = useState(false);
    const [modalChangeSaveState, setModalChangeSaveState] = useState<boolean>(false);
    const [routerChange, setRouterChange] = useState(false);

    // * EditModuleModalCustomize
    const [editModuleModalCustomizeState, setEditModuleModalCustomizeState] = useState<boolean>(false);
    const [validated, setValidated] = useState(false);
    const [editModuleData, setEditModuleData] = useState<ILauncherAssetServerModuleAddUniqueId>(initialModuleState);

    // ! myModule https://nextjs.org/docs/messages/no-assign-module-variable
    const [myModules, setMyModules] = useState<Array<ILauncherAssetServerModuleAddUniqueId>>(launcherAssetServer !== undefined ? Utils.addItemUniqueId(launcherAssetServer.modules) : []);

    useEffect(() => {
        if (!initialState) setInitialState(true);
    }, []);

    useEffect(() => {
        if (initialState) setRouterChange(true);
        if (launcherAssetServer === undefined || !initialState) return;
        setMyModules(Utils.addItemUniqueId(launcherAssetServer.modules));
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
    }, [myModules]);

    // * save the new launcher asset server
    const launcherAssetServerSave = () => {
        setModalChangeSaveState(false);
        const newLauncherAssetServer = Object.assign({}, launcherAssetServer);
        newLauncherAssetServer.modules = Utils.removeItemUniqueId(myModules);
        newLauncherAssetServer.minecraftType = Utils.getRunMinecraftType(newLauncherAssetServer);
        dispatch(setServer({ id: serverId, data: newLauncherAssetServer }));
    }

    const handleSubmit = (event: any) => {

        setValidated(true);
        event.preventDefault();

        if (event.currentTarget.checkValidity()) {

            if (editModuleData.uniqueId.length > 0) {
                const newModules = myModules.map((myModule) => {
                    if (myModule.uniqueId === editModuleData.uniqueId) {
                        myModule = editModuleData;
                    }
                    return myModule;
                });
                setMyModules(newModules);
            } else {
                setMyModules((oldValue) => [...oldValue, editModuleData]);
            }

            setEditModuleModalCustomizeState(false);
            setValidated(false);
        }
    };

    const onEditModuleModalCustomizeAddClick = (id: string) => {
        const myModule = myModules.find((myModule) => myModule.uniqueId === id);
        setEditModuleData(myModule !== undefined ? myModule : initialModuleState);
        setEditModuleModalCustomizeState(true);
    }

    const onModuleModalCustomizeAddClick = () => {
        setEditModuleData(initialModuleState);
        setEditModuleModalCustomizeState(true);
    }

    const onDeleteModulesClick = (event: any, id: string) => {
        event.stopPropagation();
        const newModules = myModules.filter((myModule) => myModule.uniqueId !== id);
        setMyModules(newModules);
    }

    const onEditModuleDataChange = (parameter: keyof ILauncherAssetServerModule, newValue: any) => {
        setEditModuleData((oldValue) => {
            const newModuleValue = Object.assign({}, oldValue);
            newModuleValue[parameter] = newValue;
            return newModuleValue;
        });
    }

    return (
        <div className={styles.launcherAssetsModule}>

            <ModalChangeSave state={modalChangeSaveState} onClickCancel={() => setModalChangeSaveState(false)} onClickConfirm={launcherAssetServerSave} />

            <ModalCustomize state={editModuleModalCustomizeState}>

                <Form noValidate validated={validated} onSubmit={handleSubmit} >

                    <div className={styles.modalCustomizeTitleDiv}>
                        <div className={styles.modalCustomizeTitleDiv_l}>
                            <h1 className={`${styles.modalCustomizeTitle} m-0`}>模組資料</h1>
                        </div>
                        <div className={styles.modalCustomizeTitleDiv_r}>
                            <Button className="me-2" variant="danger" onClick={() => setEditModuleModalCustomizeState(false)}>取消</Button>
                            <Button variant="primary" type="submit">儲存</Button>
                        </div>
                    </div>

                    <hr />

                    <Form.Group className="mb-3">
                        <Form.Label>模組名稱</Form.Label>
                        <Form.Control
                            required
                            size="lg"
                            type="text"
                            value={editModuleData.name}
                            onChange={(event) => onEditModuleDataChange("name", event.target.value)}
                        />
                        <Form.Control.Feedback type="invalid">請輸入模組名稱</Form.Control.Feedback>
                    </Form.Group>

                    <div className={`${styles.editModuleBlock_1} mb-3`}>

                        <DropMenu<ILauncherAssetServerModuleType>
                            wrapperClassName={`${styles.editModuleBlock_1_moduleTypeDropMenu} me-3`}
                            label="模組取得方式"
                            value={editModuleData.type}
                            onChange={(value) => onEditModuleDataChange("type", value)}
                            items={[
                                {
                                    label: "CurseForge",
                                    value: "CurseForge"
                                }
                            ]}
                        />

                        <DropMenu<ILauncherAssetServerModulesAction>
                            wrapperClassName={styles.editModuleBlock_2_moduleTypeDropMenu}
                            label="模組作用"
                            value={editModuleData.action}
                            onChange={(value) => onEditModuleDataChange("action", value)}
                            items={[
                                {
                                    label: "添加",
                                    value: "ADD"
                                },
                                {
                                    label: "刪除",
                                    value: "Remove"
                                }
                            ]}
                        />

                    </div>

                    <div className={`${styles.editModuleBlock_2} mb-3`}>

                        <Form.Group className="me-3" style={{ width: "200px" }}>
                            <Form.Label>Project ID</Form.Label>
                            <Form.Control size="lg" type="number" value={editModuleData.projectId} onChange={(event) => onEditModuleDataChange("projectId", event.target.value)} />
                        </Form.Group>

                        <Form.Group className="me-3" style={{ width: "200px" }}>
                            <Form.Label>File ID</Form.Label>
                            <Form.Control size="lg" type="number" value={editModuleData.fileId} onChange={(event) => onEditModuleDataChange("fileId", event.target.value)} />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>模組版本</Form.Label>
                            <Form.Control size="lg" type="text" value={editModuleData.version} onChange={(event) => onEditModuleDataChange("version", event.target.value)} />
                        </Form.Group>

                    </div>

                    <div className={styles.editModuleModuleBlockDownloadUrlInput}>

                        <DisableBlock open={editModuleData.type === "CurseForge"} />

                        <Form.Group>
                            <Form.Label>模組第三方下載位置</Form.Label>
                            <Form.Control
                                size="lg"
                                type="text"
                                value={editModuleData.downloadUrl}
                                onChange={(event) => onEditModuleDataChange("downloadUrl", event.target.value)}
                            />
                            <Form.Control.Feedback type="invalid">請輸入模組第三方下載位置</Form.Control.Feedback>
                        </Form.Group>
                    </div>

                </Form>

            </ModalCustomize>

            <div className={styles.container}>

                <h1 className={`${styles.launcherAssetsTitle} m-0`}>模組</h1>
                <h2 className={`${styles.launcherAssetsDescriptionText} m-0 mt-2`}>啟動器模組設定</h2>

                <div className={styles.block_1}>

                    <div className={`${styles.blockTitleDiv} mb-3`}>
                        <h1 className={`${styles.blockTitle} m-0`}>模組</h1>
                        {/* <Toggle className={styles.blockTitleDivToggle} state={true} /> */}
                    </div>

                    <hr />

                    <div className={styles.block_1_container}>

                        <div className={styles.moduleAdd} onClick={onModuleModalCustomizeAddClick}>
                            <h1 className={`${styles.moduleAddTitle} m-0`}>添加模組</h1>
                            <IoAddSharp className={styles.icon} />
                        </div>

                        <div className={styles.moduleItemDiv}>

                            <div className={styles.moduleItemDivTitleDiv}>
                                <h1 className={`${styles.moduleItemDivTitle} m-0`}>模組</h1>
                                <h1 className={`${styles.moduleItemDivNumber}`}>{myModules.length}</h1>
                            </div>

                            <hr />

                            <div className={styles.moduleItems}>
                                {
                                    myModules.map((myModule) => (
                                        <div key={uuidV4()} className={styles.moduleItem} onClick={() => onEditModuleModalCustomizeAddClick(myModule.uniqueId)}>

                                            <div className={styles.moduleItemLeft}>
                                                <h1 className={`${styles.moduleItemTitle} m-0`}>{myModule.name}</h1>
                                                <h1 className={`${styles.moduleItemTitle} m-0`}>{myModule.version}</h1>
                                                <h1 className={`${styles.moduleItemTitle} m-0`}>{convertModuleActionChinese(myModule.action)}</h1>
                                            </div>

                                            <div className={styles.moduleItemRight}>

                                                {/* <BiEdit className={styles.icon} /> */}
                                                <CgTrash className={styles.icon} onClick={(event) => onDeleteModulesClick(event, myModule.uniqueId)} />

                                            </div>

                                        </div>
                                    ))
                                }
                            </div>

                        </div>

                    </div>

                </div>

            </div>
        </div>
    )
}

LauncherAssetsModule.getLayout = (page: ReactElement) => {
    return (
        <DashboardLayout>
            <LauncherLayout>{page}</LauncherLayout>
        </DashboardLayout>
    );
}

LauncherAssetsModule.requireAuth = true;

interface ILauncherAssetServerModuleAddUniqueId extends ILauncherAssetServerModule {
    uniqueId: string;
}

const initialModuleState: ILauncherAssetServerModuleAddUniqueId = {
    uniqueId: "",
    name: "",
    type: "CurseForge",
    action: "ADD",
    projectId: 0,
    fileId: 0,
    version: "",
    downloadUrl: ""
}

function convertModuleActionChinese(action: ILauncherAssetServerModulesAction) {
    switch (action) {
        default:
        case "ADD":
            return "添加";
        case "Remove":
            return "刪除";
    }
}