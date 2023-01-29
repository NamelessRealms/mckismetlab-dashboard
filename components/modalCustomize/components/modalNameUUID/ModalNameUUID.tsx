import ky from "ky";
import { useEffect, useState } from "react";
import { Button, Form, FormControl, InputGroup, Spinner } from "react-bootstrap";
import ModalCustomize from "../../ModalCustomize";
import styles from "./ModalNameUUID.module.scss";

interface IProps {
    displayState: boolean;
    onDisplayClose?: (state: boolean, value?: { name: string; uuid: string; }) => void;
    playerName?: string;
    playerUUID?: string;
}

export default function ModalNameUUID(props: IProps) {

    const [validated, setValidated] = useState(false);

    // * ModalCustomize
    const [modalCustomizeState, setModalCustomizeState] = useState<boolean>(props.displayState);
    const [isGetPlayerUUID, setIsGetPlayerUUID] = useState<"loading" | "complete">("complete");

    const [playerName, setPlayerName] = useState<string>(props.playerName !== undefined ? props.playerName : "");
    const [playerUUID, setPlayerUUID] = useState<string>(props.playerUUID !== undefined ? props.playerUUID : "");

    useEffect(() => {
        if(props.playerName === undefined) setPlayerName("");
        if(props.playerUUID === undefined) setPlayerUUID("");
        setValidated(false);
        setModalCustomizeState(props.displayState);
    }, [props.displayState]);

    const handleSubmit = (event: any) => {
        setValidated(true);
        event.preventDefault();
        if (event.currentTarget.checkValidity()) {
            setModalCustomizeState(false);
            setValidated(false);

            if(props.onDisplayClose !== undefined) props.onDisplayClose(true, { name: playerName, uuid: playerUUID });
        }
    };

    const doGetPlayerUUID = async () => {

        setIsGetPlayerUUID("loading");

        if(playerName.length <= 0) {
            setIsGetPlayerUUID("complete");
            return;
        }

        const playerUuidDataResponse = await ky.get(`/dashboard/api/minecraft/user/profile/uuid/${playerName}`);

        if(!playerUuidDataResponse.ok) {
            setIsGetPlayerUUID("complete");
            return;
        }

        const playerUuidData = await playerUuidDataResponse.json() as { id: string; name: string } | null;

        if(playerUuidData === null) {
            setIsGetPlayerUUID("complete");
            return;
        }

        setPlayerUUID(playerUuidData.id);
        setPlayerName(playerUuidData.name);
        setIsGetPlayerUUID("complete");
    }

    return (
        <ModalCustomize state={modalCustomizeState}>

            <Form noValidate validated={validated} onSubmit={(event) => handleSubmit(event)} >

                <div className={styles.modalCustomizeTitleDiv}>
                    <div className={styles.modalCustomizeTitleDiv_l}>
                        <h1 className={`${styles.modalCustomizeTitle} m-0`}>玩家資料</h1>
                    </div>
                    <div className={styles.modalCustomizeTitleDiv_r}>
                        <Button className="me-2" variant="danger" onClick={() => {
                            setModalCustomizeState(false);
                            if(props.onDisplayClose !== undefined) props.onDisplayClose(false);
                        }}>取消</Button>
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
                        value={playerName}
                        onChange={(event) => setPlayerName(event.target.value)}
                    />
                    <Form.Control.Feedback type="invalid">請輸入玩家名稱</Form.Control.Feedback>
                </Form.Group>

                <InputGroup className="mb-3" style={{ width: "500px" }}>
                    <FormControl
                        required
                        size="lg"
                        placeholder="Minecraft Player UUID"
                        aria-label="Minecraft Player UUID"
                        value={playerUUID}
                        onChange={(event) => setPlayerUUID(event.target.value)}
                    />
                    {
                        isGetPlayerUUID === "complete"
                            ?
                            <Button className={styles.modalCustomizeButton} variant="secondary" onClick={() => doGetPlayerUUID()}>線上取得</Button>
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
                    <Form.Control.Feedback type="invalid">請輸入玩家 Minecraft Player UUID</Form.Control.Feedback>
                </InputGroup>

            </Form>

        </ModalCustomize>
    )
}