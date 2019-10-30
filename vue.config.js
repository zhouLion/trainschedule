module.exports = {
  devServer: {
    http2: true,
    https: true,
    host: '0.0.0.0',
    port: '8088',
    proxy: {
      '/api': {
        target: process.env.VUE_PROXY_API,
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      },
    }
  }
}
