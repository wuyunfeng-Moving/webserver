module.exports = {
    apps: [
      {
        name: 'server',
        script: './server/server.js',
        instances: 'max', // 启动最大实例数
        exec_mode: 'cluster', // 使用集群模式
        watch: false, // 不监视文件变化
        env: {
          NODE_ENV: 'production'
        }
      }
    ]
  };