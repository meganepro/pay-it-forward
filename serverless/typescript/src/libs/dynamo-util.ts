import * as util from '@libs/util';
import * as aws from 'aws-sdk';

type DynamoConfig = {
  table: (tableName: string) => string;
  client: aws.DynamoDB.DocumentClient;
};

const dynamoConfig = (): DynamoConfig => ({
  table: (tableName: string) => `payitforward-be-${process.env.NODE_ENV}-${tableName}`,
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

export const get = async (
  props: GetItemProps,
): Promise<aws.DynamoDB.DocumentClient.GetItemOutput> => {
  const { table, client } = dynamoConfig();

  try {
    const result = await client
      .get({ TableName: table(props.tableName), Key: props.key })
      .promise();

    return result;
  } catch (err) {
    console.log(err);
  }

  return undefined;
};
