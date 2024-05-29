module.exports = {
  apps: [
    {
      name: "gokz-top-web",
      port: "11514",
      env: {
        NUXT_PUBLIC_API_BASE: "https://api.gokz.top",
      },
      script: "./.output/server/index.mjs",
    },
  ],
}
