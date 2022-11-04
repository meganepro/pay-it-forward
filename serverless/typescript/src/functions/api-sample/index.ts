/* eslint-disable no-template-curly-in-string */
import { handlerPath } from '@libs/handler-resolver';
import schema from './schema';

export default {
  name: '${self:service}-${self:custom.stage}-api-sample',
  handler: `${handlerPath(__dirname)}/handler.main`,
  timeout: 30,
  events: [
    {
      http: {
        method: 'post',
        path: 'hello',
        request: {
          schemas: {
            'application/json': schema,
          },
        },
      },
    },
  ],
};
