module.exports = {
    devServer: {
      port: 8888,
      proxy: {
        '/api': {
          target: 'http://localhost:8088/v1',
          changeOrigin: true,
          secure: false,
          pathRewrite: {
            '^/api': ''
            }
        }
      }
    }
  }
