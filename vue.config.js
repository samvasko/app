module.exports = {
  lintOnSave: false,
  publicPath: process.env.NODE_ENV === "production" ? "" : "/admin/",

  devServer: {
    allowedHosts: ["localhost", ".gitpod.io"],
    public: "127.0.0.1:8080",
    proxy: (() => {
      // Setup a proxy to the API only if the API url is configured
      return "API_URL" in process.env
        ? {
            "/": {
              target: process.env.API_URL,
              changeOrigin: true
            }
          }
        : undefined;
    })()
  },

  // There are so many chunks (from all the interfaces / layouts) that we need to make sure to not
  // prefetch them all. Prefetching them all will cause the server to apply rate limits in most cases
  chainWebpack: config => {
    config.plugins.delete("prefetch");

    if (process.env.NODE_ENV === "development") {
      config.output.filename("[name].[hash].js").end();
    }
  }
};
