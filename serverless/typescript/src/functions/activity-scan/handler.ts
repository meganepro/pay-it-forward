import { formatJSONResponse } from '@libs/api-gateway';
import * as dynamoUtil from '@libs/dynamo-util';
import { middyfy } from '@libs/lambda';
import * as util from '@libs/util';
import { APIGatewayEvent } from 'aws-lambda';

const getActivity = async () => {
  const items: DynamoFlowEvent<DynamoPayItForward>[][] = [];
  items.push(
    (
      await dynamoUtil.scan({
        tableName: 'activity',
      })
    ).Items as DynamoFlowEvent<DynamoPayItForward>[],
  );

  return util.objectFilter(items.flat(), ['toNftId']) as DynamoFlowEvent<DynamoPayItForward>[];
};

const activity = async (event: APIGatewayEvent) =>
  formatJSONResponse({
    result: await getActivity(),
  }) as ResponseFormat;

export const main = middyfy(activity);
