import { io, Socket } from "socket.io-client"
import ApiService from "./ApiService";

export default class SocketIo {

    private static _clientType = "Panel";
    private static _socket: Socket | null = null;

    public static connect(id?: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {

            if(id === undefined) {
                return reject();
            }

            if (this._socket !== null && this._socket.connected) {
                return resolve();
            }

            const localStorageMklApiAuthToken = localStorage.getItem("mkl_api_authTokens");
            let authTokens = localStorageMklApiAuthToken !== null ? localStorageMklApiAuthToken : "";

            this._socket = io(ApiService.apiServerUrl, {
                query: {
                    clientType: this._clientType,
                    clientId: id
                },
                auth: {
                    token: authTokens
                }
            });

            this._socket.on("connect", () => {
                console.log("Socket Connected.");
                return resolve();
            });

            this._socket.on("disconnect", () => {
                console.log("Socket Disconnect.");
            });

            this._socket.on("connect_error", async (error) => {
                try {

                    let errorJson: { code: number; error: string; error_description: string; } | null = null;

                    try {
                        errorJson = JSON.parse(error.message);
                    } catch (e) {
                        throw new Error(error.message);
                    }

                    if (errorJson === null) return;

                    if ((errorJson.code === 400 || errorJson.code === 401) && this._socket !== null) {

                        const newTokenResponse = await fetch("/dashboard/api/auth/mkl/login");

                        if (newTokenResponse.status !== 200) {
                            throw new Error("Init socket error.");
                        }

                        const newToken = (await newTokenResponse.json() as { access_token: string }).access_token;
                        localStorage.setItem("mkl_api_authTokens", newToken);

                        (this._socket.auth as any).token = newToken;
                        this._socket.connect();
                    }

                } catch (error: any) {} finally {
                    return resolve();
                }
            });

        });
    }

    public static disconnect(): void {
        if (this._socket === null) return;
        this._socket.disconnect();
    }

    public static getSocket(): Socket {
        if (this._socket === null) throw new Error("not init socket");
        return this._socket;
    }
}