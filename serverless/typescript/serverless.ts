/* eslint-disable no-template-curly-in-string */
import ApiSample from '@functions/api-sample';
import monitor from '@functions/monitor';
import type { AWS } from '@serverless/typescript';

const serverlessConfiguration: AWS = {
  service: 'payitforward-be',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-offline', 'serverless-dynamodb-local'],
  provider: {
    name: 'aws',
    stage: 'dev',
    runtime: 'nodejs14.x',
    region: 'ap-northeast-1',
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      NODE_ENV: '${self:custom.stage}',
    },
  },
  // import the function via paths
  functions: {
    monitor,
    ApiSample,
  },
  package: { individually: true },
  custom: {
    stage: '${opt:stage, self:provider.stage}',
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    dynamodb: {
      start: { port: 8002, inMemory: true, migrate: true },
      stages: ['local', 'dev'],
    },
  },
  resources: {
    Resources: {
      Activity: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: '${self:service}-${self:custom.stage}-activity',
          AttributeDefinitions: [
            {
              AttributeName: 'from',
              AttributeType: 'S',
            },
            {
              AttributeName: 'to',
              AttributeType: 'S',
            },
            {
              AttributeName: 'fromNftId',
              AttributeType: 'N',
            },
            {
              AttributeName: 'toNftId',
              AttributeType: 'N',
            },
            {
              AttributeName: 'timestamp',
              AttributeType: 'N',
            },
          ],
          KeySchema: [
            {
              AttributeName: 'toNftId',
              KeyType: 'HASH',
            },
            {
              AttributeName: 'timestamp',
              KeyType: 'SORT',
            },
          ],
          BillingMode: 'PAY_PER_REQUEST',
          GlobalSecondaryIndexes: [
            {
              IndexName: 'from-index',
              KeySchema: [
                {
                  AttributeName: 'from',
                  KeyType: 'HASH',
                },
                {
                  AttributeName: 'timestamp',
                  KeyType: 'SORT',
                },
              ],
              Projection: {
                ProjectionType: 'INCLUDE',
                NonKeyAttributes: ['to', 'fromNftId', 'toNftId', 'context', 'transactionId'],
              },
            },
            {
              IndexName: 'to-index',
              KeySchema: [
                {
                  AttributeName: 'to',
                  KeyType: 'HASH',
                },
                {
                  AttributeName: 'timestamp',
                  KeyType: 'SORT',
                },
              ],
              Projection: {
                ProjectionType: 'INCLUDE',
                NonKeyAttributes: ['from', 'fromNftId', 'toNftId', 'context', 'transactionId'],
              },
            },
            {
              IndexName: 'toNftId-index',
              KeySchema: [
                {
                  AttributeName: 'fromNftId',
                  KeyType: 'HASH',
                },
                {
                  AttributeName: 'timestamp',
                  KeyType: 'SORT',
                },
              ],
              Projection: {
                ProjectionType: 'INCLUDE',
                NonKeyAttributes: ['from', 'to', 'toNftId', 'context', 'transactionId'],
              },
            },
          ],
          Tags: [
            {
              Key: 'Service',
              Value: '${self:service}',
            },
            {
              Key: 'Stage',
              Value: '${self:custom.stage}',
            },
          ],
          PointInTimeRecoverySpecification: {
            PointInTimeRecoveryEnabled: true,
          },
        },
      },
      CurrentBlock: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: '${self:service}-${self:custom.stage}-key-values',
          AttributeDefinitions: [
            {
              AttributeName: 'key',
              AttributeType: 'S',
            },
          ],
          KeySchema: [
            {
              AttributeName: 'key',
              KeyType: 'HASH',
            },
          ],
          BillingMode: 'PAY_PER_REQUEST',
          Tags: [
            {
              Key: 'Service',
              Value: '${self:service}',
            },
            {
              Key: 'Stage',
              Value: '${self:custom.stage}',
            },
          ],
          PointInTimeRecoverySpecification: {
            PointInTimeRecoveryEnabled: true,
          },
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
