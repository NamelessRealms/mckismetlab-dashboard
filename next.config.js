/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  compress: false,
  basePath: "/dashboard",
  // experimental: {
  //   outputStandalone: true
  // },
  i18n: {
    locales: ["zh-TW"],
    defaultLocale: "zh-TW",
  },
  // head: {
  //   htmlAttrs: {
  //     lang: 'en',
  //   }
  // },
  env: {
    discordApiBaseUrl: "https://discord.com/api/v10",
    mcKismetLabDiscordGuildId: process.env.MCKISMETLAB_DISCORD_GUILD_ID || "357527332686266381"
  }
}

module.exports = nextConfig
