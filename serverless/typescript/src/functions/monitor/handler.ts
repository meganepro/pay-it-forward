/* eslint-disable no-nested-ternary */
import * as flowUtil from '@libs/flow-util';

const config: FlowConfig = {
  domain:
    process.env.NODE_ENV === 'stg'
      ? 'https://rest-testnet.onflow.org/v1/'
      : process.env.NODE_ENV === 'prd'
      ? 'https://rest-mainnet.onflow.org/v1/'
      : 'http://localhost:8888/v1/',
  contractAddress:
    process.env.NODE_ENV === 'stg'
      ? 'A.f8d6e0586b0a20c7'
      : process.env.NODE_ENV === 'prd'
      ? 'A.f8d6e0586b0a20c7'
      : 'A.f8d6e0586b0a20c7',
};

type PayItForwardPayload = {
  fromNftId: number;
  toNftIds: number[];
  from: string;
  to: string;
  context: string;
  timestamp: number;
};

export const handler = async (event, context) => {
  const eventData = await flowUtil.getEvent(config, 1, 9);
  const data = flowUtil.parseEventData<PayItForwardPayload>(eventData);
  console.log(data);

  return {};
};

export const main = handler;
