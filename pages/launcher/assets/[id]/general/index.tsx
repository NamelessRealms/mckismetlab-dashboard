import LauncherLayout from "../../../../../components/layout/launcherLayout/LauncherLayout";
import PanelLayout from "../../../../../components/layout/panelLayout/PanelLayout";
import styles from "./General.module.scss";
import { v4 as uuidV4 } from "uuid";
import { GetServerSideProps } from "next";
import { ReactElement, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Button, Form, FormControl, InputGroup, Spinner } from "react-bootstrap";
import { CgTrash } from "react-icons/cg";
import { IoAddSharp } from "react-icons/io5";
import IMojangManifestVersion, { IManifestVersion } from "../../../../../interfaces/IMojangManifestVersion";
import DropMenu from "../../../../../components/dropMenu/DropMenu";
import Toggle from "../../../../../components/toggle/Toggle";
import { ILauncherAssetServerActionPlayer, ILauncherAssetServerActionType, ILauncherAssetServerMinecraftType } from "../../../../../interfaces/ILauncherAssets";
import ModalChangeSave from "../../../../../components/modalChangeSave/ModalChangeSave";
import ModalCustomize from "../../../../../components/modalCustomize/ModalCustomize";
import ApiService from "../../../../../utils/ApiService";
// import { wrapper } from "../../../../../store/store";
// import { useDispatch, useSelector } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../../../../store/hooks";
import { setServer } from "../../../../../store/slices/launcherAssetsSlice";
import Utils from "../../../../../utils/Utils";
import DisableBlock from "../../../../../components/disableBlock/DisableBlock";

enum IWhitelistActionState {
    ALL_BE_USABLE = "all",
    WHITELIST = "whitelist",
    BLACKLIST = "blacklist"
}

interface IProps {
    mojangManifestVersion: IMojangManifestVersion | null
}

export default function LauncherAssetsGeneral(props: IProps) {

    const router = useRouter();
    const serverId = router.query.id as string;
    const launcherAssetServers = useAppSelector((state) => state.launcherAssets.servers);
    const launcherAssetServer = launcherAssetServers.find((server) => server.id === serverId);
    const dispatch = useAppDispatch();
    // const launcherAssetServer = useSelector((state: any) => state.launcherAssets.servers).find((server: any) => server.id === serverId);

    const [initialState, setInitialState] = useState(false);
    const [validated, setValidated] = useState(false);
    const [routerChange, setRouterChange] = useState(false);

    // * ModalChangeSave
    const [modalChangeSaveState, setModalChangeSaveState] = useState<boolean>(false);

    // * ModalCustomize
    const [modalCustomizeState, setModalCustomizeState] = useState<boolean>(false);
    const [isGetPlayerUUID, setIsGetPlayerUUID] = useState<"loading" | "complete">("complete");
    // const [modalCustomizePlayerName, setModalCustomizePlayerName] = useState<string>("");
    // const [modalCustomizePlayerUUID, setModalCustomizeGetPlayerUUID] = useState<string>("");

    const [name, setName] = useState<string>(launcherAssetServer !== undefined ? launcherAssetServer.name : "");
    const [imageUrl, setImageUrl] = useState<string>(launcherAssetServer !== undefined ? launcherAssetServer.imageUrl : "");
    const [officialWebLinkUrl, setOfficialWebLinkUrl] = useState<string>(launcherAssetServer !== undefined ? launcherAssetServer.officialWebLinkUrl : "");
    const [description, setDescription] = useState<string>(launcherAssetServer !== undefined ? launcherAssetServer.description : "");
    const [minecraftType, setMinecraftType] = useState<ILauncherAssetServerMinecraftType>(launcherAssetServer !== undefined ? launcherAssetServer.minecraftType : "minecraftVanilla");
    const [minecraftVersion, setMinecraftVersion] = useState<string>(launcherAssetServer !== undefined ? launcherAssetServer.minecraftVersion : "");
    const [actionType, setActionType] = useState<ILauncherAssetServerActionType>(launcherAssetServer !== undefined ? launcherAssetServer.action.type : "whitelist");
    const [actionPlayers, setActionPlayers] = useState<Array<ILauncherAssetServerGeneralUniqueId>>(launcherAssetServer !== undefined ? Utils.addItemUniqueId(launcherAssetServer.action.players) : []);

    const [editActionPlayer, setEditActionPlayer] = useState<ILauncherAssetServerGeneralUniqueId>(initialActionPlayerState);
    // const []

    const [actionTypeToggle, setActionTypeToggle] = useState<boolean>(actionType !== "all");

    useEffect(() => {
        if (!initialState) setInitialState(true);
    }, []);

    useEffect(() => {
        if (initialState) setRouterChange(true);
        if (launcherAssetServer === undefined || !initialState) return;
        setName(launcherAssetServer.name);
        setImageUrl(launcherAssetServer.imageUrl);
        setOfficialWebLinkUrl(launcherAssetServer.officialWebLinkUrl);
        // setMinecraftType(launcherAssetServer.minecraftType);
        setMinecraftVersion(launcherAssetServer.minecraftVersion);
        setActionType(launcherAssetServer.action.type);
        setActionPlayers(Utils.addItemUniqueId(launcherAssetServer.action.players));
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
    }, [name, imageUrl, officialWebLinkUrl, description, minecraftType, minecraftVersion, actionType, actionPlayers, actionTypeToggle]);

    if (launcherAssetServer === undefined) {
        return <></>;
    }

    // * save the new launcher asset server
    const launcherAssetServerSave = () => {
        setModalChangeSaveState(false);
        const newLauncherAssetServer = Object.assign({}, launcherAssetServer);

        newLauncherAssetServer.name = name;
        newLauncherAssetServer.imageUrl = imageUrl;
        newLauncherAssetServer.officialWebLinkUrl = officialWebLinkUrl;
        newLauncherAssetServer.description = description;
        newLauncherAssetServer.minecraftType = Utils.getRunMinecraftType(newLauncherAssetServer);
        newLauncherAssetServer.minecraftVersion = minecraftVersion;
        newLauncherAssetServer.action = {
            type: actionTypeToggle ? actionType : "all",
            players: actionPlayers
        }

        dispatch(setServer({
            id: serverId,
            data: newLauncherAssetServer
        }));
    }

    const handleSubmit = (event: any, id: string) => {
        setValidated(true);
        event.preventDefault();
        if (event.currentTarget.checkValidity()) {

            if (editActionPlayer.uniqueId.length > 0) {
                const newActionPlayers = actionPlayers.map((actionPlayer) => {
                    if (actionPlayer.uniqueId === editActionPlayer.uniqueId) {
                        actionPlayer = editActionPlayer;
                    }
                    return actionPlayer;
                });
                setActionPlayers(newActionPlayers);
            } else {
                const newEditActionPlayer = Utils.copyObjectArray(editActionPlayer);
                newEditActionPlayer.uniqueId = uuidV4();
                setActionPlayers((oldValue) => [...oldValue, newEditActionPlayer]);
            }

            setModalCustomizeState(false);
            setValidated(false);
        }
    };

    const onModalCustomizeStateClick = async (id: string, playerName: string) => {
        setIsGetPlayerUUID("loading");
        try {
            const uuid = await ApiService.getMinecraftPlayerUUID(playerName);
            if (uuid === null) throw new Error("Api get player UUID error.");
            setEditActionPlayer((oldValue) => {
                const newValue = Utils.copyObjectArray(oldValue);
                newValue.uuid = uuid;
                return newValue;
            });
        } catch (error) {
            console.error(error);
        }
        setIsGetPlayerUUID("complete");
    }

    const onDeleteWhitelistClick = (event: any, id: string) => {
        event.stopPropagation();
        const newActionPlayers = actionPlayers.filter((actionPlayer) => actionPlayer.uniqueId !== id);
        setActionPlayers(newActionPlayers);
    }

    const onEditWhitelistModalCustomizeClick = (id: string) => {
        const actionPlayer = actionPlayers.find((actionPlayer) => actionPlayer.uniqueId === id);
        if (actionPlayer === undefined) return;
        setEditActionPlayer(actionPlayer);
        setModalCustomizeState(true);
    }

    const onEditWhitelistDataChange = (parameter: keyof ILauncherAssetServerActionPlayer, newValue: any) => {
        setEditActionPlayer((oldValue) => {
            const newWhitelistValue = Utils.copyObjectArray(oldValue);
            newWhitelistValue[parameter] = newValue;
            return newWhitelistValue;
        });
    }

    const onWhitelistModalCustomizeAddClick = () => {
        setEditActionPlayer(initialActionPlayerState);
        setModalCustomizeState(true);
    }

    return (
        <div className={styles.launcherAssetsGeneral}>

            <ModalChangeSave state={modalChangeSaveState} onClickCancel={() => setModalChangeSaveState(false)} onClickConfirm={launcherAssetServerSave} />

            <ModalCustomize state={modalCustomizeState}>

                <Form noValidate validated={validated} onSubmit={(event) => handleSubmit(event, editActionPlayer.uniqueId)} >

                    <div className={styles.modalCustomizeTitleDiv}>
                        <div className={styles.modalCustomizeTitleDiv_l}>
                            <h1 className={`${styles.modalCustomizeTitle} m-0`}>玩家資料</h1>
                        </div>
                        <div className={styles.modalCustomizeTitleDiv_r}>
                            <Button className="me-2" variant="danger" onClick={() => setModalCustomizeState(false)}>取消</Button>
                            <Button variant="primary" type="submit">儲存</Button>
                        </div>
                    </div>

                    <hr />

                    <Form.Group className="mb-3">
                        <Form.Label>玩家名稱</Form.Label>
                        <Form.Control
                            required
                            size="lg"
                            type="text"
                            value={editActionPlayer.name} onChange={(event) => onEditWhitelistDataChange("name", event.target.value)} />
                        <Form.Control.Feedback type="invalid">請輸入玩家名稱</Form.Control.Feedback>
                    </Form.Group>

                    <InputGroup className="mb-3" style={{ width: "400px" }}>
                        <FormControl
                            required
                            size="lg"
                            placeholder="Minecraft UUID"
                            aria-label="Minecraft UUID"
                            value={editActionPlayer.uuid}
                            onChange={(event) => onEditWhitelistDataChange("uuid", event.target.value)}
                        />
                        {
                            isGetPlayerUUID === "complete"
                                ?
                                <Button className={styles.modalCustomizeButton} variant="secondary" onClick={() => onModalCustomizeStateClick(editActionPlayer.uniqueId, editActionPlayer.name)}>線上取得</Button>
                                :
                                <Button className={styles.modalCustomizeButton} variant="secondary" disabled>
                                    <Spinner
                                        className="me-2"
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                    />
                                    線上取得
                                </Button>
                        }
                        <Form.Control.Feedback type="invalid">請輸入玩家 Minecraft UUID</Form.Control.Feedback>
                    </InputGroup>

                </Form>

            </ModalCustomize>

            <div className={`${styles.container}`}>

                <h1 className={`${styles.launcherAssetsGeneralTitle} m-0`}>一般</h1>
                <h2 className={`${styles.launcherAssetsGeneralDescription} m-0 mt-2`}>啟動器一般設定</h2>

                <div className={`${styles.serverDescription}`}>

                    <h1 className={`${styles.serverBlockTitle} mb-3`}>伺服器</h1>
                    <hr />

                    <div className={`${styles.serverDescriptionTop}`}>

                        <div className={`${styles.sdt_l}`}>
                            <div className={`${styles.serverImgDiv}`}>
                                {
                                    imageUrl.length > 0
                                        ?
                                        <img
                                            className={styles.serverImg}
                                            src={imageUrl}
                                            alt="Server Image Url"
                                        />
                                        :
                                        name.length > 0
                                            ?
                                            <h1 className={`${styles.serverImgText} m-0`}>{`${name.slice(0, 1)}-${name.split("").pop()}`}</h1>
                                            :
                                            <h1 className={`${styles.serverImgText} m-0`}>無</h1>
                                }
                            </div>
                        </div>

                        <div className={`${styles.sdt_r}`}>
                            <Form.Group className="mb-3">
                                <Form.Label>伺服器名稱</Form.Label>
                                <Form.Control size="lg" type="text" value={name} onChange={(event) => setName(event.target.value)} />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>伺服器圖片網址</Form.Label>
                                <Form.Control size="lg" type="text" placeholder="https://" value={imageUrl} onChange={(event) => setImageUrl(event.target.value)} />
                            </Form.Group>
                        </div>

                    </div>

                    <hr />

                    <div className={`${styles.serverDescriptionBottom}`}>
                        <Form.Group className="mb-3">
                            <Form.Label>伺服器官網網址</Form.Label>
                            <Form.Control size="lg" type="text" placeholder="https://" value={officialWebLinkUrl} onChange={(event) => setOfficialWebLinkUrl(event.target.value)} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>伺服器描述</Form.Label>
                            <Form.Control as="textarea" value={description} onChange={(event) => setDescription(event.target.value)} />
                        </Form.Group>
                    </div>

                </div>

                <div className={styles.serverType}>

                    <h1 className={`${styles.serverBlockTitle} mb-3`}>啟動類型</h1>
                    <hr />

                    {/* <Form.Group className="mb-3">
                        <Form.Label>啟動類型</Form.Label>
                        <Form.Select size="lg" style={{ width: "400px" }} value={minecraftType} onChange={(event) => setMinecraftType(event.target.value as any)}>
                            <option value="minecraftModpack">模組包</option>
                            <option value="minecraftModules">模組</option>
                            <option value="minecraftVanilla">原版</option>
                        </Form.Select>
                    </Form.Group> */}

                    <Form.Group>
                        <Form.Label>Minecraft 版本</Form.Label>
                        <Form.Select size="lg" style={{ width: "400px" }} value={minecraftVersion} onChange={(event) => setMinecraftVersion(event.target.value)}>
                            {
                                props.mojangManifestVersion !== null
                                    ?
                                    getReleaseVersion(props.mojangManifestVersion).map((version) => (
                                        <option key={uuidV4()} value={version.id}>{version.id}</option>
                                    ))
                                    : null
                            }
                        </Form.Select>
                    </Form.Group>

                </div>

                <div className={styles.whitelist}>

                    <div className={`${styles.whitelistTitleDiv} mb-3`}>

                        <div className={styles.whitelistTitleDiv_l}>
                            <h1 className={`${styles.serverBlockTitle} m-0 mx-2`}>白名單</h1>
                        </div>

                        <div className={styles.whitelistTitleDiv_r}>
                            <Toggle className={styles.whitelistTitleDiv_r_toggle} state={actionTypeToggle} onChange={(state) => setActionTypeToggle(state)} />
                            <DropMenu
                                className={styles.whitelistTitleDiv_r_dropMenu}
                                disable={!actionTypeToggle}
                                value={actionType !== "all" ? actionType : IWhitelistActionState.WHITELIST}
                                onChange={(value) => setActionType(value)}
                                items={[
                                    {
                                        label: "白名單模式",
                                        value: IWhitelistActionState.WHITELIST
                                    },
                                    {
                                        label: "黑名單模式",
                                        value: IWhitelistActionState.BLACKLIST
                                    }
                                ]}
                            />
                        </div>

                    </div>

                    <hr />

                    <div className={styles.whitelistUsersContainer}>

                        <DisableBlock open={!actionTypeToggle} />

                        <div className={styles.whitelistAdd} onClick={onWhitelistModalCustomizeAddClick}>
                            <h1 className={`${styles.whitelistAddTitle} m-0`}>添加玩家</h1>
                            <IoAddSharp className={styles.icon} />
                        </div>

                        <div className={styles.whitelistUsers}>

                            <div className={styles.whitelistUsersTitleDiv}>
                                <h1 className={`${styles.whitelistUsersTitle} m-0`}>玩家</h1>
                                <h1 className={`${styles.whitelistUsersNumber}`}>{actionPlayers.length}</h1>
                            </div>

                            <hr />

                            <div className={styles.whitelists}>
                                {
                                    actionPlayers.map((actionPlayer) => (
                                        <div key={uuidV4()} className={styles.whitelistUser} onClick={() => onEditWhitelistModalCustomizeClick(actionPlayer.uniqueId)}>

                                            <div className={styles.whitelist_l}>

                                                <h1 className={`${styles.whitelistUserText} m-0`}>{actionPlayer.name}</h1>
                                                <h1 className={`${styles.whitelistUserText} m-0`}>{actionPlayer.uuid}</h1>

                                            </div>

                                            <div className={styles.whitelist_r}>

                                                <CgTrash className={styles.icon} onClick={(event) => onDeleteWhitelistClick(event, actionPlayer.uniqueId)} />

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

LauncherAssetsGeneral.getLayout = (page: ReactElement) => {
    return (
        <PanelLayout>
            <LauncherLayout>{page}</LauncherLayout>
        </PanelLayout>
    );
}

LauncherAssetsGeneral.requireAuth = true;

export const getServerSideProps: GetServerSideProps = async (context) => {

    const mojangManifestVersionResponse = await fetch("https://launchermeta.mojang.com/mc/game/version_manifest.json");

    let mojangManifestVersion: IMojangManifestVersion | null = null;

    if (mojangManifestVersionResponse.status === 200) {
        mojangManifestVersion = await mojangManifestVersionResponse.json();
    }

    return {
        props: {
            mojangManifestVersion
        }
    }
}

const initialActionPlayerState: ILauncherAssetServerGeneralUniqueId = {
    uniqueId: "",
    name: "",
    uuid: ""
}

interface ILauncherAssetServerGeneralUniqueId extends ILauncherAssetServerActionPlayer {
    uniqueId: string;
}

// export const getServerSideProps = wrapper.getServerSideProps((store) => async () => {

//     const mojangManifestVersionResponse = await fetch("https://launchermeta.mojang.com/mc/game/version_manifest.json");

//     let mojangManifestVersion: IMojangManifestVersion | null = null;

//     if (mojangManifestVersionResponse.status === 200) {
//         mojangManifestVersion = await mojangManifestVersionResponse.json();
//     }

//     return {
//         props: {
//             mojangManifestVersion
//         }
//     }
// });

function getReleaseVersion(mojangManifestVersion: IMojangManifestVersion): Array<IManifestVersion> {
    const versions = mojangManifestVersion.versions;
    return versions.filter((version) => version.type === "release");
}