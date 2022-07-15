import * as collections from "@constants/services";
import { Request } from "express";

const initServices = (collections: any) => {
  const result: any = {};
  Object.values(collections).forEach((collection: string) => {
    result[collection] = require(`@services/${collection}`);
  });
  return result;
};

const services = initServices(collections);

const getService = function (req: Request) {
  return function (this: Request, collection: string) {
    const service = services[collection];
    if (!service) {
      throw new Error(`Service not found: ${collection}`);
    }
    const newService: any = { ...new service.default() };
    newService.req = this;
    newService.service = getService(this);
    return newService;
  };
};

export default getService;
