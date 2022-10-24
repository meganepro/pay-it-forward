// import schema from "./schema";
import { handlerPath } from "@libs/handler-resolver";

export default {
  name: "${self:service}-${self:custom.stage}-monitor",
  handler: `${handlerPath(__dirname)}/handler.main`,
  timeout: 30,
  events: [
    {
      schedule: "cron(*/5 * * * ? *)"
      // http: {
      //   method: "post",
      //   path: "hello",
      //   request: {
      //     schemas: {
      //       "application/json": schema
      //     }
      //   }
      // }
    }
  ]
};
