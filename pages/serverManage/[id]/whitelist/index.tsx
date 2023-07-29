import { useRouter } from "next/router";
import { CSSProperties, Fragment, ReactElement, useEffect, useState } from "react";
import DashboardLayout from "../../../../components/layout/dashboardLayout/DashboardLayout";
import ServerMangeWhitelistLayout from "../../../../components/layout/serverMangeWhitelistLayout/ServerMangeWhitelistLayout";
import SocketIo from "../../../../utils/SocketIo";
import styles from "./Whitelist.module.scss";
import { GrStatusInfo } from "react-icons/gr";
import { IoAddSharp, IoCheckboxOutline, IoPeopleSharp } from "react-icons/io5";
import { v4 as uuidV4 } from "uuid";
import InputIcon from "../../../../components/inputIcon/InputIcon";
import ApiService from "../../../../utils/ApiService";
import { CgTrash } from "react-icons/cg";
import { Badge, Button, Form, OverlayTrigger, Spinner, Tooltip } from "react-bootstrap";
import Toggle from "../../../../components/toggle/Toggle";
import ky from "ky";
import ModalNameUUID from "../../../../components/modalCustomize/components/modalNameUUID/ModalNameUUID";
import { BiEdit } from "react-icons/bi";
import TextEditInput from "../../../../components/textEditInput/TextEditInput";
import React from "react";
import SpinnerCenter from "../../../../components/spinnerCenter/SpinnerCenter";
import ModalPlayerInfo from "../../../../components/modalCustomize/components/modalPlayerInfo/ModalPlayerInfo";
import { ISkinCapeProfiles } from "../../../api/minecraft/user/profile/names/[[...uuid]]";

export default function ServerManageWhitelist() {

    // const { data: session } = useSession();

    // const initSocket = async () => {
    //     await SocketIo.connect(session?.userId);
    // }

    // useEffect(() => {
    //     initSocket();
    //     return () => SocketIo.disconnect();
    // }, []);

    const router = useRouter();
    const serverId = router.query.id as string;

    // * Search whitelist user input
    const [searchWhitelistUserInput, setSearchWhitelistUserInput] = useState<string>("");

    // * ModalChangeSave
    const [modalChangeSaveState, setModalChangeSaveState] = useState<boolean>(false);

    // * ModalNameUUID
    const [modalNameUuidDisplayState, setModalNameUuidDisplayState] = useState<boolean>(false);

    // * Data
    const [whitelistUsers, setWhitelistUsers] = useState<Array<IWhitelistUser> | null>(new Array<IWhitelistUser>());
    const [totalWhitelistNumber, setTotalWhitelistNumber] = useState<number>(60);
    const [totalWhitelistNumberInput, setTotalWhitelistNumberInput] = useState<number>(totalWhitelistNumber);

    // * ModalPlayerInfo State
    const [modalPlayerInfoState, setModalPlayerInfoState] = useState<{ open: boolean, uuid: string | null }>({ open: false, uuid: null });

    const fetchWhitelistUsers = async (serverId: string) => {

        const whitelistUsersResponse = await fetch(`${ApiService.apiServerUrl}/whitelist/serverWhitelist/${serverId}`);
        const sponsorUsersResponse = await fetch(`${ApiService.apiServerUrl}/sponsor/user`);

        if ((whitelistUsersResponse.status !== 200 && whitelistUsersResponse.status !== 304) || (sponsorUsersResponse.status !== 200 && sponsorUsersResponse.status !== 304)) {
            setWhitelistUsers(null);
            return;
        }

        const sponsorUsers: Array<{ id: number; minecraft_uuid: string; money: number; }> = await sponsorUsersResponse.json();
        const fetchWhitelistUsers: Array<IWhitelistUser> = new Array<IWhitelistUser>();
        const whitelistUsersData = await whitelistUsersResponse.json() as Array<{ id: string; minecraft_uuid: string, server_id: string }>;
        const whitelistUsersUUID = whitelistUsersData.map((whitelistUser) => whitelistUser.minecraft_uuid);

        const playerProfilesResponse = await ky("/dashboard/api/minecraft/user/profile/names", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            json: whitelistUsersUUID
        });

        if (!playerProfilesResponse.ok) {
            return;
        }

        const playerProfiles: Array<ISkinCapeProfiles> = await playerProfilesResponse.json();

        for (let playerProfile of playerProfiles) {

            if (playerProfile.name === null) continue;

            const findSponsorUser = sponsorUsers.find((sponsorUser) => sponsorUser.minecraft_uuid === playerProfile.id);

            fetchWhitelistUsers.push({
                id: uuidV4(),
                whitelistUserTextEditInputState: false,
                display: true,
                name: playerProfile.name,
                uuid: playerProfile.id,
                isSponsor: findSponsorUser !== undefined
            });
        }

        if (fetchWhitelistUsers.length <= 0) return;

        setWhitelistUsers(fetchWhitelistUsers);
    }

    useEffect(() => {
        setWhitelistUsers([]);
        fetchWhitelistUsers(serverId);
    }, [serverId]);

    const searchWhitelistUserFilter = (searchValue: string) => {
        setWhitelistUsers((oldValue) => {
            if (oldValue === null) return oldValue;
            for (let i = 0; i < oldValue.length; i++) {
                oldValue[i].display = true;
                if (searchValue !== undefined && searchValue.length > 0) {
                    if (oldValue[i].name.toLowerCase().indexOf(searchValue.toLowerCase()) === -1 && oldValue[i].uuid.toLowerCase().indexOf(searchValue.toLowerCase()) === -1) {
                        oldValue[i].display = false;
                    }
                }
            }
            return oldValue;
        });
    }

    const getInfoValue = (getValueType: GetValueType) => {
        switch (getValueType) {
            case "openWhitelistUserNumber":
                return totalWhitelistNumber;
            case "allWhitelistUserNumber":
                return whitelistUsers !== null ? whitelistUsers.length : "ERROR";
            case "remainingPlacesNumber":
                return whitelistUsers !== null ? (totalWhitelistNumber - whitelistUsers.length) : "ERROR";
            default:
                return "ERROR"
        }
    }

    const changeWhitelistUserTextEditInput = (newValue: IWhitelistUser) => {
        setWhitelistUsers((oldValue) => {
            if (oldValue === null) return oldValue;
            return oldValue.map((value) => {
                if (value.id === newValue.id) value = newValue;
                return value;
            });
        });
    }

    const deleteWhitelistUser = (id: string) => {
        setWhitelistUsers((oldValue) => {
            if (oldValue === null) return oldValue;
            return oldValue.filter((value) => value.id !== id);
        });
    }

    const modalNameUUIDAddItem = (value: { name: string; uuid: string; }) => {
        setWhitelistUsers((oldValue) => {
            if (oldValue === null) return oldValue;
            return [{ ...value, id: uuidV4(), whitelistUserTextEditInputState: false, display: true, isSponsor: false }, ...oldValue];
        });
    }

    return (
        <>

            <ModalNameUUID
                displayState={modalNameUuidDisplayState}
                onDisplayClose={(state, value) => {
                    if (state && value !== undefined) modalNameUUIDAddItem(value);
                    setModalNameUuidDisplayState(false);
                }}
            />

            {
                modalPlayerInfoState.open
                    ?
                    <ModalPlayerInfo
                        open={true}
                        playerUUID={modalPlayerInfoState.uuid}
                        onClose={() => setModalPlayerInfoState({ open: false, uuid: null })}
                    />
                    :
                    null
            }

            <div className={styles.serverManageWhitelist}>

                <div className={`${styles.container}`}>

                    <h1 className={`${styles.serverManageWhitelistTitle} m-0`}>管理</h1>

                    <div className={styles.wrapperContainer}>
                        <div className={styles.serverManageWhitelistLeft}>

                            <div className={styles.whitelistUsersDiv}>

                                <div className={`${styles.blockTitleDiv} mb-3`}>
                                    <h1 className={`${styles.blockTitle} m-0`}>玩家名單</h1>
                                </div>

                                <hr />

                                <div className={styles.whitelistUsersDiv_container}>

                                    <InputIcon
                                        className={styles.searchWhitelistUserInput}
                                        placeholder="搜尋玩家..."
                                        type="text"
                                        icon="search"
                                        value={searchWhitelistUserInput}
                                        onChange={(value) => {
                                            setSearchWhitelistUserInput(value);
                                            searchWhitelistUserFilter(value);
                                        }}
                                    />

                                    <div className={styles.whitelistUsersAdd} onClick={() => setModalNameUuidDisplayState(true)}>
                                        <h1 className={`${styles.whitelistUsersAddTitle} m-0`}>添加玩家</h1>
                                        <IoAddSharp className={styles.whitelistUsersAddIcon} />
                                    </div>

                                    <hr />

                                    <div className={styles.whitelistUsers}>
                                        {
                                            whitelistUsers !== null
                                                ?
                                                whitelistUsers.length > 0
                                                    ?
                                                    whitelistUsers.map((whitelistUser) => (
                                                        <WhitelistUserJSXElement
                                                            style={!whitelistUser.display ? { display: "none" } : {}}
                                                            key={uuidV4()}
                                                            whitelistUser={whitelistUser}
                                                            onChange={changeWhitelistUserTextEditInput}
                                                            onDeleteItemClick={() => deleteWhitelistUser(whitelistUser.id)}
                                                            onClick={() => {
                                                                setModalPlayerInfoState({ open: true, uuid: whitelistUser.uuid });
                                                            }}
                                                        />
                                                    ))
                                                    :
                                                    <SpinnerCenter spinnerHeight="10vh" />
                                                :
                                                <h1 className={styles.whitelistNotPlayers}>Whitelist Not Player</h1>
                                        }
                                    </div>

                                </div>
                            </div>

                        </div>

                        <div className={styles.serverManageWhitelistRight}>

                            <div className={styles.serverManageWhitelistRightBlock_1}>

                                <div className={styles.whitelistInfoTitleDiv}>
                                    <GrStatusInfo className={styles.whitelistInfoTitleIcon} />
                                    <h1 className={styles.whitelistInfoTitle}>資訊</h1>
                                </div>

                                {
                                    whitelistUsers !== null
                                        ?
                                        whitelistUsers.length > 0
                                            ?
                                            <div className={styles.whitelistInfosDiv}>
                                                {
                                                    whitelistInfos.map((info, index) => (
                                                        <div className={styles.whitelistInfo} key={uuidV4()} style={((index + 1) % 2) === 0 ? { marginLeft: "50px" } : {}}>
                                                            <div className={styles.whitelistInfoLeft}>
                                                                {info.iconElement}
                                                            </div>
                                                            <div className={styles.whitelistInfoRight}>
                                                                <h1 className={`${styles.whitelistInfoText} ${styles.whitelistInfoTextTop}`}>{info.title}</h1>
                                                                <h1 className={styles.whitelistInfoText}>
                                                                    {
                                                                        info.getValueType !== undefined
                                                                            ?
                                                                            getInfoValue(info.getValueType)
                                                                            :
                                                                            info.value
                                                                    }
                                                                </h1>
                                                            </div>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                            :
                                            <SpinnerCenter spinnerHeight="10vh" />
                                        :
                                        <h1 className={styles.whitelistNotPlayers}>Whitelist Not Player</h1>
                                }

                            </div>

                            <div className={styles.whitelistManageDiv}>

                                <div className={`${styles.blockTitleDiv} mb-3`}>
                                    <h1 className={`${styles.blockTitle} m-0`}>設定</h1>
                                </div>

                                <hr />

                                <div className={styles.whitelistManageDivBlock_1}>

                                    <Form.Group className="m-0" style={{ width: "100%" }}>
                                        <Form.Label>開放人數</Form.Label>
                                        <Form.Control
                                            size="lg"
                                            type="number"
                                            value={totalWhitelistNumberInput}
                                            onChange={(event) => setTotalWhitelistNumberInput(Number(event.target.value))}
                                        />
                                    </Form.Group>

                                </div>

                                <hr />

                                <Toggle
                                    wrapperToggleClassName={styles.openStateWrapperToggle}
                                    title="開放狀態"
                                    titleDisplay="left"
                                    state={true}
                                />

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </>
    )
}

interface IWhitelistUserJSXElementProps {
    display?: boolean;
    whitelistUser: IWhitelistUser;
    onChange?: (value: IWhitelistUser) => void;
    onDeleteItemClick?: () => void;
    onClick?: () => void;
    style?: CSSProperties;
}

function WhitelistUserJSXElement(props: IWhitelistUserJSXElementProps) {

    const [whitelistUserTextEditInputState, setWhitelistUserTextEditInputState] = useState<boolean>(false);
    const [whitelistUserName, setWhitelistUserName] = useState<string>(props.whitelistUser.name);
    const [whitelistUserUUID, setWhitelistUserUUID] = useState<string>(props.whitelistUser.uuid);

    const confirmEdit = () => {
        if (props.onChange !== undefined) props.onChange(Object.assign(props.whitelistUser, {
            name: whitelistUserName,
            uuid: whitelistUserUUID
        }));
        setWhitelistUserTextEditInputState(false);
    }

    return (
        <div className={styles.whitelistUserDiv} style={props.style} onClick={props.onClick}>

            <div className={styles.whitelistUserLeft}>

                <TextEditInput
                    className={styles.whitelistUserTextEditInput}
                    value={whitelistUserName}
                    editState={whitelistUserTextEditInputState}
                    onChange={(value) => setWhitelistUserName(value)}
                />
                <TextEditInput
                    className={styles.whitelistUserTextEditInput}
                    value={whitelistUserUUID}
                    editState={whitelistUserTextEditInputState}
                    onChange={(value) => setWhitelistUserUUID(value)}
                />

            </div>

            <div className={styles.whitelistUserRight}>

                <div className={styles.whitelistUserBadgeDiv}>
                    <Badge className={styles.whitelistUserBadge} bg="primary" style={{ margin: 0 }}>一般玩家</Badge>
                    {
                        props.whitelistUser.isSponsor
                            ?
                            <Badge className={styles.whitelistUserBadge} bg="warning" text="dark">贊助者</Badge>
                            :
                            null
                    }
                </div>

                <div className={styles.whitelistUserRightButtonDiv}>
                    {
                        whitelistUserTextEditInputState
                            ?
                            <IoCheckboxOutline className={`${styles.whitelistUserRightIcon} ${styles.whitelistUserRightConfirmIcon}`} onClick={confirmEdit} />
                            :
                            <BiEdit className={styles.whitelistUserRightIcon} onClick={() => setWhitelistUserTextEditInputState(true)} />
                    }

                    <CgTrash className={styles.whitelistUserRightIcon} onClick={props.onDeleteItemClick} />
                </div>

            </div>

        </div>
    )
}

ServerManageWhitelist.getLayout = (page: ReactElement) => {
    return (
        <DashboardLayout>
            <ServerMangeWhitelistLayout>{page}</ServerMangeWhitelistLayout>
        </DashboardLayout>
    );
}

ServerManageWhitelist.requireAuth = true;

interface IWhitelistUserOptions {
    whitelistUserTextEditInputState: boolean;
    id: string;
    display: boolean;
}

interface IWhitelistUser extends IWhitelistUserOptions {
    [value: string]: string | boolean;
    name: string;
    uuid: string;
    isSponsor: boolean;
}

type GetValueType = "allWhitelistUserNumber" | "remainingPlacesNumber" | "openWhitelistUserNumber";

interface IWhitelistInfos {
    title: string;
    getValueType?: GetValueType,
    value?: string | number;
    iconElement: JSX.Element;
}

const whitelistInfos: Array<IWhitelistInfos> = [
    {
        title: "白名總人數",
        getValueType: "allWhitelistUserNumber",
        iconElement: <IoPeopleSharp className={styles.whitelistInfoIcon} />
    },
    {
        title: "剩餘名額",
        getValueType: "remainingPlacesNumber",
        iconElement: <IoPeopleSharp className={styles.whitelistInfoIcon} />
    },
    {
        title: "開放人數",
        getValueType: "openWhitelistUserNumber",
        iconElement: <IoPeopleSharp className={styles.whitelistInfoIcon} />
    }
]