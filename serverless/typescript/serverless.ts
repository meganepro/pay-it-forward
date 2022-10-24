import type { AWS } from "@serverless/typescript";

import monitor from "@functions/monitor";

const serverlessConfiguration: AWS = {
  service: "payitforward-be",
  frameworkVersion: "3",
  plugins: ["serverless-esbuild"],
  provider: {
    name: "aws",
    stage: "dev",
    runtime: "nodejs14.x",
    region: "ap-northeast-1",
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000"
    }
  },
  // import the function via paths
  functions: { monitor },
  package: { individually: true },
  custom: {
    stage: "${opt:stage, self:provider.stage}",
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node14",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10
    }
  },
  resources: {
    Resources: {
      Activity: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          TableName: "${self:service}-${self:custom.stage}-activity",
          AttributeDefinitions: [
            {
              AttributeName: "from",
              AttributeType: "S"
            },
            {
              AttributeName: "to",
              AttributeType: "S"
            }
          ],
          KeySchema: [
            {
              AttributeName: "from",
              KeyType: "HASH"
            }
          ],
          BillingMode: "PAY_PER_REQUEST",
          GlobalSecondaryIndexes: [
            {
              IndexName: "to-index",
              KeySchema: [
                {
                  AttributeName: "to",
                  KeyType: "HASH"
                }
              ],
              Projection: {
                ProjectionType: "ALL"
              }
            }
          ],
          Tags: [
            {
              Key: "Service",
              Value: "${self:service}"
            },
            {
              Key: "Stage",
              Value: "${self:custom.stage}"
            }
          ],
          PointInTimeRecoverySpecification: {
            PointInTimeRecoveryEnabled: true
          }
        }
      }
    }
  }
};

module.exports = serverlessConfiguration;
