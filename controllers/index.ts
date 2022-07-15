import * as collections from "@constants/controller";
import { Request } from "express";

const initServices = (collections: any) => {
  const result: any = {};
  Object.values(collections).forEach((collection: string) => {
    result[collection] = require(`@controllers/${collection}`);
  });
  return result;
};

const controllers = initServices(collections);

const runController = function (req: Request) {
  return function (this: Request, collection: string) {
    const controller = controllers[collection];
    if (!controller) {
      throw new Error(`Service not found: ${collection}`);
    }
    const newController: any = { ...new controller.default() };
    newController.req = this;
    newController.controller = runController(this);
    return newController;
  };
};

export default runController;
