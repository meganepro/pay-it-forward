import * as util from '@libs/util';
import * as aws from 'aws-sdk';

type DynamoConfig = {
  table: (tableName: string) => string;
  client: aws.DynamoDB.DocumentClient;
};

const dynamoConfig = (): DynamoConfig => ({
  table: (tableName: string) => `${process.env.SERVICE}-${process.env.NODE_ENV}-${tableName}`,
  client:
    process.env.NODE_ENV === 'dev'
      ? new aws.DynamoDB.DocumentClient({ endpoint: 'http://localhost:8002/shell' })
      : new aws.DynamoDB.DocumentClient(),
});

// TODO delete table
type BatchWriteItemProps<T> = {
  tableName: string;
  createItems: T[];
};

export const batchWriteItem = <T>(props: BatchWriteItemProps<T>[]): void => {
  const { table, client } = dynamoConfig();
  const requestItems: aws.DynamoDB.DocumentClient.BatchWriteItemRequestMap = {};

  props.forEach((prop) => {
    // create
    util.arrayChunk(prop.createItems, 25).forEach((createItems) => {
      requestItems[table(prop.tableName)] = [];
      createItems.forEach((item) => {
        requestItems[table(prop.tableName)].push({
          PutRequest: {
            Item: { ...item },
          },
        });
      });
      client.batchWrite(
        {
          RequestItems: requestItems,
        },
        (err, _) => {
          if (err) console.log(err);
        },
      );
    });
  });
  // delete
};

type PutItemProps<T> = {
  tableName: string;
  createItem: T;
};

export const put = async <T>(props: PutItemProps<T>): Promise<void> => {
  const { table, client } = dynamoConfig();
  try {
    await client.put({ TableName: table(props.tableName), Item: props.createItem }).promise();
  } catch (err) {
    console.log(err);
  }
};

type GetItemProps = {
  tableName: string;
  key: { [key in string]: unknown };
};

// TODO async使わない形に治す
export const get = async (
  props: GetItemProps,
): Promise<aws.DynamoDB.DocumentClient.GetItemOutput> => {
  const { table, client } = dynamoConfig();

  try {
    return await client.get({ TableName: table(props.tableName), Key: props.key }).promise();
  } catch (err) {
    console.log(err);
  }

  return undefined;
};

type BatchGetItemProps = {
  tableName: string;
  keyName: string;
  keys: unknown[];
};
// TODO need check
export const batchGetItem = async <T>(props: BatchGetItemProps[]) => {
  const { table, client } = dynamoConfig();
  const requestItems = {};
  const items = await Promise.all(
    props.map(async (prop) => {
      // get
      await Promise.all(
        util.arrayChunk(prop.keys, 100).map(async (keys) => {
          requestItems[table(prop.tableName)] = { Keys: [] };
          keys.forEach((key) => {
            requestItems[table(prop.tableName)].Keys.push({
              [prop.keyName]: key,
            });
          });
          try {
            const result = await client.batchGet({ RequestItems: requestItems }).promise();

            return result.Responses;
          } catch (err) {
            console.log(err);
          }

          return undefined;
        }),
      );
    }),
  );
  console.log(items);

  return items as T[];
};

type QueryItemProps = aws.DynamoDB.DocumentClient.QueryInput;

const query = async (props: QueryItemProps): Promise<aws.DynamoDB.DocumentClient.QueryOutput> => {
  const { table: _, client } = dynamoConfig();

  try {
    return await client.query({ ...props }).promise();
  } catch (err) {
    console.log(err);
  }

  return undefined;
};

type QueryHashProps = {
  tableName: string;
  indexName: string;
  keyName: string;
  value: unknown;
};

export const queryHash = async <T>(props: QueryHashProps) => {
  const { table, client: _ } = dynamoConfig();

  const result = await query({
    TableName: table(props.tableName),
    IndexName: props.indexName,
    KeyConditionExpression: `${props.keyName} = :hashKey`,
    ExpressionAttributeValues: { ':hashKey': props.value },
  });

  return result.Items as T;
};

type QueryHashesProps = Omit<QueryHashProps, 'value'> & {
  values: unknown[];
};

export const queryHashes = async <T>(props: QueryHashesProps) => {
  const { table, client: _ } = dynamoConfig();

  const results: T[][] = await Promise.all(
    props.values.map(async (value) => {
      const result = await query({
        TableName: table(props.tableName),
        IndexName: props.indexName,
        KeyConditionExpression: `${props.keyName} = :hashKey`,
        ExpressionAttributeValues: { ':hashKey': value },
      });

      return result.Items as T[];
    }),
  );

  return results.flat();
};

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#get-property
