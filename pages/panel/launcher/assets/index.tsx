import PanelLayout from "../../../../components/layout/panelLayout/PanelLayout";
import ILauncherAssets from "../../../../interfaces/ILauncherAssets";
import styles from "./LauncherAssets.module.scss";
import { ReactElement, useEffect } from "react";
import { GetServerSideProps } from "next";
import { v4 as uuidV4 } from "uuid";
import { Button } from "react-bootstrap";
import { useRouter } from "next/router";
import { setLauncherAssets } from "../../../../store/slices/launcherAssetsSlice";
// import { useDispatch, useSelector } from "react-redux";
// import { wrapper } from "../../../../store/store";
import { useAppDispatch } from "../../../../store/hooks";
import ApiService from "../../../../utils/ApiService";

interface IProps {
    launcherAssets: ILauncherAssets | null
}

export default function LauncherAssets(props: IProps) {

    const router = useRouter();
    // const launcherAssetServers = useSelector((state: any) => state.launcherAssets);
    const dispatch = useAppDispatch();

    const onClick = (id: string) => {
        router.push(`/panel/launcher/assets/${id}/general`);
    }

    useEffect(() => {
        if (props.launcherAssets === null) return;
        dispatch(setLauncherAssets(props.launcherAssets));
    }, [dispatch, props.launcherAssets]);

    if (props.launcherAssets === null) {
        return (
            <div className="row justify-content-center align-items-center" style={{ height: "100%" }}>
                <h1 style={{ color: "red", textAlign: "center" }}>Error: Api response not status 200</h1>
            </div>
        )
    }

    return (
        <div className={`${styles.launcherAssets}`}>

            <h1 className={styles.launcherAssetsTitle}>選擇伺服器</h1>

            <div className={styles.servers}>
                {
                    props.launcherAssets.servers.map((server: any) => (
                        <div key={uuidV4()} className={styles.server}>

                            <div className={styles.serverTop}>

                                <div className={styles.serverImg}>
                                    <h1 className={`${styles.serverImgText} m-0`}>{`${server.id.slice(0, 1)}-${server.id.split("").pop()}`}</h1>
                                </div>

                            </div>

                            <div className={`${styles.serverBottom}`}>

                                <h1 className={`${styles.serverTitle} m-0`}>{server.id}</h1>
                                <Button
                                    variant="primary"
                                    onClick={() => onClick(server.id)}
                                >設定</Button>

                            </div>

                        </div>
                    ))
                }
            </div>

        </div>
    )
}

LauncherAssets.getLayout = (page: ReactElement) => {
    return <PanelLayout>{page}</PanelLayout>;
}

LauncherAssets.requireAuth = true;

// export const getServerSideProps = wrapper.getServerSideProps((store) => async () => {

//     const url = `${process.env.MKL_API_SERVER_URL}/launcher/v2/assets`;
//     const launcherAssetsResponse = await fetch(url);

//     let launcherAssets: { id: number, date: string, assets_data: ILauncherAssets } | null = null;

//     if (launcherAssetsResponse.status === 200) {
//         launcherAssets = await launcherAssetsResponse.json();
//     }

//     if(launcherAssets !== null) {
//         store.dispatch(setVersion(launcherAssets.assets_data.version));
//         store.dispatch(setUpdated(launcherAssets.assets_data.updated));
//         store.dispatch(setServers(launcherAssets.assets_data.servers));
//     }

//     return {
//         props: {
//             launcherAssets: launcherAssets !== null ? launcherAssets.assets_data : null
//         }
//     }
// });

export const getServerSideProps: GetServerSideProps = async (context) => {

    const url = `${ApiService.apiServerUrl}/launcher/v2/assets`;
    const launcherAssetsResponse = await fetch(url);

    let launcherAssets: { id: number, date: string, assets_data: ILauncherAssets } | null = null;

    if (launcherAssetsResponse.status === 200) {
        launcherAssets = await launcherAssetsResponse.json();
    }

    return {
        props: {
            launcherAssets: launcherAssets !== null ? launcherAssets.assets_data : null
        }
    }
}