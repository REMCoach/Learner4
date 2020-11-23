const chalk = require("chalk");
const { PORT, HOST } = require("./config/index.js");
const app = require("./app");

const http = require("http");
const server = http.Server(app);

server.listen(PORT, HOST, () =>
  console.log(chalk.blue(`Server started @ http://${HOST}:${PORT}/`))
);
