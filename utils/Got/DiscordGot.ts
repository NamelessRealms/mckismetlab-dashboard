import got from "got";

export default got.extend({
    hooks: {
        beforeRequest: [
            async (options) => {
                options.headers["Authorization"] = `Bot ${process.env.DISCORD_BOT_TOKEN}`
            }
        ]
    },
    responseType: "json"
});