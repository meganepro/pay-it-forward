import { formatJSONResponse } from '@libs/api-gateway';
import * as dynamoUtil from '@libs/dynamo-util';
import { middyfy } from '@libs/lambda';
import * as util from '@libs/util';
import { APIGatewayEvent } from 'aws-lambda';

type ActivityProps = {
  addresses?: string;
  nftIds?: string;
};

type Activity = {
  addresses: string[];
  nftIds: string[];
};

const getActivityFromAddress = async (addresses: string[]) => {
  const items: DynamoFlowEvent<DynamoPayItForward>[][] = [];
  items.push(
    await dynamoUtil.queryHashes<DynamoFlowEvent<DynamoPayItForward>>({
      tableName: 'activity',
      indexName: 'to-index',
      keyName: 'toAddress',
      values: addresses,
    }),
  );

  items.push(
    await dynamoUtil.queryHashes<DynamoFlowEvent<DynamoPayItForward>>({
      tableName: 'activity',
      indexName: undefined,
      keyName: 'fromAddress',
      values: addresses,
    }),
  );

  return util.objectFilter(items.flat(), ['toNftId']) as DynamoFlowEvent<DynamoPayItForward>[];
};

const activity = async (event: APIGatewayEvent) => {
  const { queryStringParameters: _query } = event;
  if (!_query) {
    return formatJSONResponse({
      result: [],
    }) as ResponseFormat;
  }
  const props: Activity = {
    addresses: (_query as ActivityProps).addresses?.split(',') ?? [],
    nftIds: (_query as ActivityProps).nftIds?.split(',') ?? [],
  };

  return formatJSONResponse({
    result: await getActivityFromAddress(props.addresses),
  }) as ResponseFormat;
};

export const main = middyfy(activity);
