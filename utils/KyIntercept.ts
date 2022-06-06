import ky, { Options } from "ky";

export default async function customFetcher(url: string, config: Options = {}) {

    const localStorageMklApiAuthToken = localStorage.getItem("mkl_api_authTokens");
    let authTokens = localStorageMklApiAuthToken !== null ? localStorageMklApiAuthToken : "";

    config.headers = {
        Authorization: authTokens
    }

    let response: Response | null = null;

    try {

        response = await ky(url, config);

    } catch (error: any) {

        if (error.response.status === 400 || error.response.status === 401) {

            const newTokenResponse = await fetch("/dashboard/api/auth/mkl/login");

            if (newTokenResponse.status !== 200) {
                return response;
            }

            const newToken = (await newTokenResponse.json() as { access_token: string }).access_token;

            if (newToken === undefined) return response;

            config.headers = {
                Authorization: newToken
            }

            localStorage.setItem("mkl_api_authTokens", newToken);

            const newResponse = await ky(url, config);
            response = newResponse;
        }

    }

    return response;
}