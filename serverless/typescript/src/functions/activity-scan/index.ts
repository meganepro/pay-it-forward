/* eslint-disable no-template-curly-in-string */
import { handlerPath } from '@libs/handler-resolver';

export default {
  name: '${self:service}-${self:custom.stage}-activity-scan',
  handler: `${handlerPath(__dirname)}/handler.main`,
  timeout: 30,
  events: [
    {
      http: {
        method: 'get',
        path: 'activity/scan',
        cors: true,
      },
    },
  ],
};
