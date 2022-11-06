/* eslint-disable no-nested-ternary */
import * as dynamoUtil from '@libs/dynamo-util';
import * as flowUtil from '@libs/flow-util';

const flowConfig: FlowConfig = {
  domain:
    process.env.NODE_ENV === 'stg'
      ? 'https://rest-testnet.onflow.org/v1/'
      : process.env.NODE_ENV === 'prd'
      ? 'https://rest-mainnet.onflow.org/v1/'
      : 'http://localhost:8888/v1/',
  contractAddress:
    process.env.NODE_ENV === 'stg'
      ? 'A.50d1f821e592d38a'
      : process.env.NODE_ENV === 'prd'
      ? ''
      : 'A.f8d6e0586b0a20c7',
  readBlockStep: process.env.NODE_ENV === 'stg' ? 49 : process.env.NODE_ENV === 'prd' ? 49 : 1,
};

export const handler = async (event, context) => {
  // 読みはじめのブロック情報を取得
  const startPosition = await dynamoUtil.get({ tableName: 'key-values', key: { key: 'blockId' } });
  if (!startPosition || startPosition.Item === undefined) {
    console.log('blockId is not found.');

    return {};
  }

  // イベントを取得
  const { eventData, position } = await flowUtil.getEvents(flowConfig, startPosition.Item.value);

  // イベントをDBに保存
  const datas = flowUtil.parseEventData<PayItForwardPayload>(eventData);
  // toNftIdsはばらして1レコードずつにする
  const dynamoDatas: DynamoFlowEvent<DynamoPayItForward>[] = datas
    .map((data) => {
      const { toNftIds, from, to, ...rest } = data;

      return toNftIds.map(
        (toNftId) =>
          ({
            toNftId,
            fromAddress: from,
            toAddress: to,
            ...rest,
          } as DynamoFlowEvent<DynamoPayItForward>),
      ) as DynamoFlowEvent<DynamoPayItForward>[];
    })
    .flat();
  dynamoUtil.batchWriteItem([{ tableName: 'activity', createItems: dynamoDatas }]);
  // console.log(dynamoDatas);

  // 最後の読み出し位置を保存
  dynamoUtil.put({ tableName: 'key-values', createItem: { key: 'blockId', value: position } });

  return {};
};

export const main = handler;
