module.exports = {
  apps: [{
    name: "bibliogen-server",
    script: "server.js",
    watch: false,  // Disable watch mode
    ignore_watch: ["node_modules", "test"],
    max_memory_restart: "1G",
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production"
    },
    error_file: "logs/err.log",
    out_file: "logs/out.log",
    autorestart: true,
    restart_delay: 3000  // Increase delay between restarts
  }]
}