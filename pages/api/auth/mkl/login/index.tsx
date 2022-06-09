import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

export default async function MklSignIn(req: NextApiRequest, res: NextApiResponse) {
    try {

        const session = await getSession({ req });

        if(session === null || !session.isAdmin) {
            throw new Error("Login api server failure.");
        }

        const apiServerUrl = process.env.NODE_ENV === "development" ? "http://localhost:8030" : "https://mckismetlab.net/api";
        const response = await fetch(apiServerUrl + "/oauth2/token", {
            method: "POST",
            mode: "no-cors",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                grant_type: process.env.API_GRANT_TYPE,
                username: process.env.API_USERNAME,
                password: process.env.API_PASSWORD
            })
        });

        if (response.status !== 200) {
            throw new Error("Login api server failure.");
        }

        res.status(200).json({ access_token: (await response.json()).access_token });

    } catch (error: any) {
        throw new Error("Login api server failure.");
    }
}