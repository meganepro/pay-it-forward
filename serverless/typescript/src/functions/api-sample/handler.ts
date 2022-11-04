import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';
import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';

const monitor: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) =>
  formatJSONResponse({
    message: `Hello ${event.body.name}, welcome to the exciting Serverless world!`,
    event,
  });

export const main = middyfy(monitor);
