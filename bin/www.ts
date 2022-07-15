require("dotenv").config();

import App from "../app";
import * as bodyParser from "body-parser";
import logger from "morgan";
import InitReqRes from "@middlewares/init";
import AuthRoute from "@routes/auth";

const DEFAULT_PORT = 8000;

const normalizePort = (val: string): number => {
  const port = parseInt(val.toString(), 10);
  if (!isNaN(port) && port >= 0) {
    return port;
  }

  return DEFAULT_PORT;
};

const app = new App({
  port: normalizePort(process.env.PORT || "") || DEFAULT_PORT,
  middlewares: [
    InitReqRes.init,
    logger("dev"),
    bodyParser.json(),
    bodyParser.urlencoded({ extended: true }),
  ],
  routers: [new AuthRoute()],
});

app.listen();
