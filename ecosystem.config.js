module.exports = {
  apps: [
    {
      name: 'FRENCHIE TOKEN TELEGRAM BOT',
      script: 'src/index.js',
      exec_mode: 'fork',
      instances: 1,
      max_memory_restart: '200M',
    },
  ],
};
