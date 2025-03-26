module.exports = {
  apps: [
    {
      name: 'work-whiz',
      script: './dist/work-whiz/main.js',
      instances: 'max',
      exec_mode: 'cluster',
      watch: true,
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
