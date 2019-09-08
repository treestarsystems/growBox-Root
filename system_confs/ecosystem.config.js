module.exports = {
  apps : [{
    name        : "growBox-Root",
    script      : "server/index.js",
    watch       : true,
    cwd         : "/opt/growBox-Root",
    instances	: "max",
    exec_mode	: "cluster",
    watch	: ["./server","./system_confs"],
    ignore_watch	: ["./log_storage","./db_storage","./message_storage"],
    out_file	: "./log_storage/growBox-Root_out.log",
    error_file	: "./log_storage/growBox-Root_err.log",
    pid_file	: "./log_storage/pid/growBox-Root_id.pid",
    log_date_format	: "YYYY-MM-DD HH:mm Z",
    env: {
      "NODE_ENV": "prod",
      "PORT": "3001",
      "HOST": "localhost"
    },
    env_dev : {
      "NODE_ENV": "dev",
      "PORT": "3101",
      "HOST": "localhost"
    }
  }]
}