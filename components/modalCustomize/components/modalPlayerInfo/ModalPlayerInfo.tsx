import ky from "ky";
import { v4 as uuidV4 } from "uuid";
import { ReactNode, useEffect, useState } from "react";
import ModalCustomize from "../../ModalCustomize";
import styles from "./modalPlayerInfo.module.scss";
import { CgClose } from "react-icons/cg";
import * as skinview3d from "skinview3d";
import Image from "next/image";
import steveSkin3d from "../../../../assets/images/skin/steve_skin_3d.png";
import { IoCheckboxOutline, IoReload } from "react-icons/io5";
import TextStateLights from "../../../textStateLights/TextStateLights";
import Tooltips from "../../../tooltips/Tooltips";
import FoldTitle from "../../../foldTitle/FoldTitle";
import { BiCopy } from "react-icons/bi";
import { Badge } from "react-bootstrap";
import { ServerIdTypes } from "../../../../interfaces/GlobalTypes";
import MinecraftServers from "../../../../data/minecraft_servers.json";
import minecraftServersImage01 from "../../../../assets/images/background/server_1.png";
import minecraftServersImage02 from "../../../../assets/images/background/server_2.png";
import minecraftServersImage03 from "../../../../assets/images/background/server_2.png";
import { GrHistory } from "react-icons/gr";
import Utils from "../../../../utils/Utils";
import React from "react";
import SpinnerCenter from "../../../spinnerCenter/SpinnerCenter";
import User, { IDiscordMember } from "../../../../utils/User";
import DiscordRole, { DiscordGuildRole } from "../../../../utils/Discord/DiscordRole";

interface IMinecraftPlayerTexture {
    uuid: string;
    textures: {
        skin: string | null;
        cape: string | null;
    } | null;
}

interface IProps {
    open: boolean;
    playerUUID: string;
}

export default function ModalPlayerInfo(props: IProps) {

    // * ModalCustomize
    const [modalCustomizeState, setModalCustomizeState] = useState<boolean>(props.open);

    const [initialFetchDataState, setInitialFetchDataState] = useState<"loading" | "complete" | "error">("loading");
    const [playerNamesHistoryBoxState, setPlayerNamesHistoryBoxState] = useState<boolean>(false);

    const [playerServerNames, setPlayerServerNames] = useState<Array<{ id: string; name: string; }> | null>([]);
    const [playerProfileNames, setPlayerProfileNames] = useState<{ nowName: string; historyNames: Array<{ changedToAt: number; name: string; }> } | null>(null);
    const [userDiscordProfile, setUserDiscordProfile] = useState<IDiscordMember | null>(null);

    // TODO:
    const [userDiscordGuildRoles, setUserDiscordGuildRoles] = useState<Array<{ id: string, name: string; }>>([]);

    const fetchPlayerData = async () => {

        const discordGuildMember = await User.getDiscordGuildMember(process.env.mcKismetLabDiscordGuildId as string, "177388464948510720");
        if (discordGuildMember !== null) setUserDiscordProfile(discordGuildMember);
        const discordGuildRoles = await DiscordRole.getDiscordGuildRoles(process.env.mcKismetLabDiscordGuildId as string);
        if (discordGuildRoles !== null && discordGuildMember !== null) {
            setUserDiscordGuildRoles(() => {
                const roles = new Array<{ id: string, name: string; }>();
                for (let discordGuildRoleId of discordGuildMember.roles) {
                    const findGuildRole = discordGuildRoles.find((guildRole) => guildRole.id === discordGuildRoleId);
                    if (findGuildRole !== undefined) roles.push({ id: findGuildRole.id, name: findGuildRole.name });
                }
                return roles;
            });
        }

        const playerProfilesResponse = await ky(`/dashboard/api/minecraft/user/profile/names/${props.playerUUID}`);

        if (!playerProfilesResponse.ok) {
            setInitialFetchDataState("error");
            return;
        }

        const playerProfile: { uuid: string; names: Array<{ changedToAt: number; name: string }> | null } = await playerProfilesResponse.json();

        if (playerProfile.names !== null) {
            const nowName = playerProfile.names.pop();
            if (nowName !== undefined) {
                setPlayerProfileNames({
                    nowName: nowName.name,
                    historyNames: playerProfile.names
                });
            }
        }

        setInitialFetchDataState("complete");
    }

    const initialPlayer3dView = async () => {

        const playerTexturesResponse = await ky(`/dashboard/api/minecraft/user/profile/texture/${props.playerUUID}`);

        if (!playerTexturesResponse.ok) {
            return;
        }

        const playerTexture: IMinecraftPlayerTexture = await playerTexturesResponse.json();
        const viewController = document.getElementById("skin_container") as HTMLCanvasElement | null;
        if (viewController === null || playerTexture.textures === null || playerTexture.textures.skin === null) return;

        const skinViewer = new skinview3d.FXAASkinViewer({
            canvas: viewController,
            width: 120,
            height: 270,
            skin: playerTexture.textures.skin
        });

        const control = skinview3d.createOrbitControls(skinViewer);
        control.enableRotate = true;
        control.enableZoom = false;
        control.enablePan = false;

        skinViewer.animations.add(skinview3d.WalkingAnimation).speed = 0.5;
    }

    useEffect(() => {

        if (process.env.NODE_ENV === "production") {
            initialPlayer3dView();
        }

        fetchPlayerData();

    }, []);

    return (
        <ModalCustomize state={modalCustomizeState}>
            <div className={styles.modalPlayerInfo}>

                <div className={styles.modalPlayerTitleDiv}>

                    <div className={styles.modalPlayerTitleLeft}>
                        <img className={styles.modalPlayerHeadImg} src={`https://crafatar.com/renders/head/${props.playerUUID}?overlay`} alt="Player Head" />
                        <h1 className={styles.modalPlayerNameTitle}>{playerProfileNames !== null ? playerProfileNames.nowName : "........"}</h1>
                    </div>

                    <div className={styles.modalPlayerTitleRight}>
                        <CgClose className={styles.modalPlayerTitleCloseIcon} onClick={() => setModalCustomizeState(false)} />
                    </div>

                </div>

                <hr />

                {
                    initialFetchDataState === "loading"
                        ?
                        <SpinnerCenter spinnerHeight="10vh" />
                        :
                        <div className={styles.modalPlayerInfoContainer}>

                            <div className={styles.modalPlayerInfoLeft}>

                                <div className={styles.modalPlayer3dView} style={!playerNamesHistoryBoxState ? { padding: "10px 15px" } : { display: "block" }}>
                                    {
                                        playerNamesHistoryBoxState
                                            ?
                                            <div className={styles.modalPlayerNamesHistory}>
                                                {
                                                    playerProfileNames !== null
                                                        ?
                                                        <>
                                                            {
                                                                playerProfileNames.historyNames.map((playerProfile) => (
                                                                    <React.Fragment key={uuidV4()}>
                                                                        <div className={styles.modalPlayerNameHistory}>

                                                                            <div className={styles.modalPlayerNameHistoryLeft}>
                                                                                <h1 className={styles.modalPlayerNameHistoryName}>{playerProfile.name}</h1>
                                                                                <h1 className={styles.modalPlayerNameHistoryTime}>{playerProfile.changedToAt !== undefined ? Utils.formatDateTime(playerProfile.changedToAt) : "Not Time"}</h1>
                                                                            </div>

                                                                            <div className={styles.modalPlayerNameHistoryRight}>
                                                                                <CopyTextClipboard copyValue={playerProfile.name} />
                                                                            </div>

                                                                        </div>
                                                                        <hr className={styles.modalPlayerNameHistoryHr} />
                                                                    </React.Fragment>
                                                                ))
                                                            }
                                                        </>
                                                        : "ERROR"
                                                }
                                            </div>
                                            :
                                            process.env.NODE_ENV === "production"
                                                ?
                                                <canvas id="skin_container" />
                                                :
                                                <Image
                                                    width={120}
                                                    height={270}
                                                    src={steveSkin3d}
                                                    alt="Player Skin"
                                                />
                                    }
                                </div>

                                <div className={styles.modalPlayerInfoToolsButtonDiv}>

                                    <Tooltips title="重新讀取">
                                        <div className={styles.modalPlayerInfoToolsIconDiv}>
                                            <IoReload className={styles.modalPlayerInfoToolsIcon} />
                                        </div>
                                    </Tooltips>

                                    <Tooltips title="Minecraft 改名歷史">
                                        <div
                                            className={styles.modalPlayerInfoToolsIconDiv}
                                            style={playerNamesHistoryBoxState ? { backgroundColor: "rgba(255, 255, 255, 0.1)" } : {}}
                                            onClick={() => setPlayerNamesHistoryBoxState((oldValue) => !oldValue)}
                                        >
                                            <GrHistory className={`${styles.modalPlayerInfoToolsIcon_2} ${playerNamesHistoryBoxState ? styles.modalPlayerInfoToolsIcon_2_hover : null}`} />
                                        </div>
                                    </Tooltips>

                                </div>

                                <div className={styles.modalPlayerInfoStateDiv}>
                                    <TextStateLights
                                        title="Discord 帳戶綁定"
                                        state={true}
                                        tooltipsTitles={["已綁定", "未綁定"]}
                                    />
                                    <TextStateLights
                                        title="Discord 線上"
                                        state={true}
                                        tooltipsTitles={["已上線", "未上線"]}
                                    />
                                    <TextStateLights
                                        title="Minecraft 線上"
                                        state={false}
                                        tooltipsTitles={["已上線", "未上線"]}
                                    />
                                    <TextStateLights
                                        title="伺服器贊助者"
                                        state={false}
                                        tooltipsTitles={["贊助者", "未贊助"]}
                                    />
                                </div>

                            </div>

                            <div className={styles.modalPlayerInfoRight}>

                                <FoldTitle
                                    className={styles.modalPlayerInfoRightFoldTitle}
                                    title="Discord 玩家資料"
                                    open={true}
                                >
                                    <div className={styles.modalPlayerInfoDiscordDiv}>

                                        <div className={styles.modalPlayerInfoDiscordUserDiv}>

                                            <div className={styles.modalPlayerInfoDiscordUserLeft}>

                                                <div className={styles.modalPlayerInfoDiscordUserImg}>

                                                    {
                                                        userDiscordProfile !== null && userDiscordProfile.user !== null && userDiscordProfile.user.avatar !== null
                                                            ?
                                                            <div style={{ width: "100%", height: "100%", borderRadius: "10%", backgroundImage: `url(https://cdn.discordapp.com/avatars/${userDiscordProfile?.user?.id}/${userDiscordProfile?.user?.avatar}.png)` }}></div>
                                                            :
                                                            <div className={styles.modalPlayerInfoDiscordNotImg}>
                                                                <svg width="71" height="55" viewBox="0 0 71 55" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <g clipPath="url(#clip0)">
                                                                        <path d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.440769 45.4204 0.525289C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.525289C25.5141 0.443589 25.4218 0.40133 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2785 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9293 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.038 50.6034 51.2554 52.5699 52.5959 54.435C52.6519 54.5139 52.7526 54.5477 52.845 54.5195C58.6464 52.7249 64.529 50.0174 70.6019 45.5576C70.6551 45.5182 70.6887 45.459 70.6943 45.3942C72.1747 30.0791 68.2147 16.7757 60.1968 4.9823C60.1772 4.9429 60.1437 4.9147 60.1045 4.8978ZM23.7259 37.3253C20.2276 37.3253 17.3451 34.1136 17.3451 30.1693C17.3451 26.225 20.1717 23.0133 23.7259 23.0133C27.308 23.0133 30.1626 26.2532 30.1066 30.1693C30.1066 34.1136 27.28 37.3253 23.7259 37.3253ZM47.3178 37.3253C43.8196 37.3253 40.9371 34.1136 40.9371 30.1693C40.9371 26.225 43.7636 23.0133 47.3178 23.0133C50.9 23.0133 53.7545 26.2532 53.6986 30.1693C53.6986 34.1136 50.9 37.3253 47.3178 37.3253Z" fill="#ffffff" />
                                                                    </g>
                                                                    <defs>
                                                                        <clipPath id="clip0">
                                                                            <rect width="71" height="55" fill="white" />
                                                                        </clipPath>
                                                                    </defs>
                                                                </svg>
                                                            </div>
                                                    }
                                                </div>

                                            </div>

                                            <div className={styles.modalPlayerInfoDiscordUserRight}>

                                                <TextTools
                                                    title="Tag"
                                                    value={userDiscordProfile !== null ? userDiscordProfile.user !== null ? `${userDiscordProfile.user.username}#${userDiscordProfile.user.discriminator}` : "null" : "null"}
                                                />

                                                <TextTools
                                                    title="暱稱"
                                                    value={userDiscordProfile !== null ? userDiscordProfile.nick !== null ? userDiscordProfile.nick : "null" : "null"}
                                                />

                                                <TextTools
                                                    title="ID"
                                                    value={userDiscordProfile !== null ? userDiscordProfile.user !== null ? userDiscordProfile.user.id : "null" : "null"}
                                                />

                                            </div>

                                        </div>

                                        <hr />

                                        <div className={styles.modalPlayerInfoDiscordUserIdentityGroup}>

                                            <h1 className={styles.modalPlayerInfoDiscordUserIdentityGroupTitle}>身分組</h1>

                                            <div className={styles.modalPlayerInfoDiscordUserIdentityGroup}>
                                                {
                                                    userDiscordGuildRoles.map((discordUserIdentityGroup) => (
                                                        <Badge key={uuidV4()} bg="primary" className={styles.discordUserIdentityGroupBadge}>{discordUserIdentityGroup.name}</Badge>
                                                    ))
                                                }
                                            </div>

                                        </div>

                                    </div>
                                </FoldTitle>

                                <FoldTitle
                                    className={styles.modalPlayerInfoRightFoldTitle}
                                    title="Minecraft 玩家資料"
                                    open={true}
                                >
                                    <div className={styles.playerInfoMinecraftDiv}>

                                        <TextTools
                                            title="Name"
                                            value="QuasiMkl"
                                        />

                                        <TextTools
                                            title="UUID"
                                            value="93ea0589ec754cad8619995164382e8d"
                                        />

                                        <TextTools
                                            title="本季遊玩時間"
                                            value="220 時 19 分 07 秒"
                                        />

                                        <hr />

                                        <TextTools
                                            title="目前所在伺服器"
                                            rightChildren={<GetServerBanner serverId={null} />}
                                        />

                                    </div>
                                </FoldTitle>

                            </div>

                        </div>
                }


            </div>
        </ModalCustomize>
    )
}

interface ITextToolsProps {
    title: string;
    value?: string;
    rightChildren?: ReactNode;
}

function TextTools(props: ITextToolsProps) {
    return (
        <div className={styles.modalPlayerInfoTextDiv}>

            <div className={styles.modalPlayerInfoTextLeft}>
                <h1 className={styles.modalPlayerInfoText}>{props.title}</h1>
            </div>

            <div className={styles.modalPlayerInfoTextRight}>
                {
                    props.rightChildren === undefined
                        ?
                        <>
                            <h1 className={styles.modalPlayerInfoTextValue}>{props.value}</h1>
                            <div className={styles.modalPlayerInfoTextTools}>
                                <CopyTextClipboard copyValue={props.value} />
                            </div>
                        </>
                        :
                        props.rightChildren
                }
            </div>

        </div>
    )
}

interface ICopyTextClipboardProps {
    copyValue: any;
}

function CopyTextClipboard(props: ICopyTextClipboardProps) {

    const [copyTextClipboardState, setCopyTextClipboardState] = useState<boolean>(false);

    const copyTextClipboard = (text: any) => {
        navigator.clipboard.writeText(text)
            .then(() => {
                setCopyTextClipboardState(true);
                setTimeout(() => setCopyTextClipboardState(false), 1000);
            });
    }

    return (
        <>
            {
                copyTextClipboardState
                    ?
                    <IoCheckboxOutline className={`${styles.copyTextClipboardIcon} ${styles.copyTextClipboardConfirmIcon}`} />
                    :
                    <Tooltips title="複製">
                        <BiCopy className={styles.copyTextClipboardIcon} onClick={() => copyTextClipboard(props.copyValue)}></BiCopy>
                    </Tooltips>
            }
        </>
    )
}

interface IGetServerBannerElementProps {
    serverId: ServerIdTypes | null;
}

function GetServerBanner(props: IGetServerBannerElementProps) {

    const serverImages = [minecraftServersImage01, minecraftServersImage02, minecraftServersImage03];
    const serverTitle = MinecraftServers.find((server) => server.id === props.serverId);

    return (
        <div className={styles.serverBanner} style={serverTitle === undefined ? { backgroundColor: "rgba(220, 53, 69, 0.6)" } : { cursor: "pointer" }}>
            {
                serverTitle !== undefined
                    ?
                    <div className={styles.serverBannerImageDiv}>
                        <Image
                            className={styles.serverBannerImage}
                            src={serverImages[Math.floor(Math.random() * 2)]}
                            layout="fill"
                            objectFit="cover"
                        />
                    </div>
                    : null
            }
            <h1 className={styles.serverBannerTitle}>{serverTitle !== undefined ? serverTitle.name : "玩家未在任何伺服器上上線"}</h1>
        </div>
    )
}