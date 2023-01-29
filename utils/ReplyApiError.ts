import { NextApiResponse } from "next";

export default class ReplyApiError {

    public static replyServerError(response: NextApiResponse): void {
        response.status(500).json({
            error: "server_error",
            error_description: "伺服器發生非預期的錯誤。"
        });
    }

    public static replyParameterError(response: NextApiResponse): void {
        response.status(400).json({
            error: "invalid_request",
            error_description: "通訊協定錯誤，遺漏必要的參數或者參數格式錯誤。"
        });
    }

    public static replyUnauthorized(response: NextApiResponse): void {
        response.status(400).json({
            error: "invalid_client",
            error_description: "未經授權。"
        });
    }
}