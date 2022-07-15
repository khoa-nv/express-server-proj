import express, { Application } from "express";
import AuthMiddleware from "@middlewares/auth";

import ApiErrorHandler from "./middlewares/apiErrorHandler";
const { isAuthenticated } = new AuthMiddleware();

class App {
  public app: Application;
  public port: number;

  constructor(appInit: { port: number; middlewares: any[]; routers: any[] }) {
    this.app = express();
    this.port = appInit.port;
    this.middlewares(appInit.middlewares);
    this.routes(appInit.routers);
    this.app.use(ApiErrorHandler.errorHandler);
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`);
    });
  }

  private middlewares(middleWares: {
    forEach: (arg0: (middleWare: any) => void) => void;
  }) {
    middleWares.forEach((middleWare) => {
      this.app.use(middleWare);
    });
  }

  private routes(routes: { forEach: (arg0: (route: any) => void) => void }) {
    routes.forEach((route) => {
      this.app.use(route.path, route.unProtectedRoutes);
      this.app.use(route.path, isAuthenticated, route.protectedRoutes);
    });
  }
}

export default App;
