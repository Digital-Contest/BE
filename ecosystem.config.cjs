module.exports = {
    apps: [
      {
        name: '<app-name>',
        script: 'dist/index.js',
        exec_mode: 'cluster',
        instances: 2,
        kill_timeout: 5000,
        autorestart: true,
        max_restarts: 10,
        watch: true,
      },
    ],
  };
  