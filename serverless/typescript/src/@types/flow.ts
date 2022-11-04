type RequestType = 'BLOCK' | 'EVENT';

type FlowConfig = {
  domain: string;
  contractAddress: string;
  readBlockStep: number;
};

type BlockEvent = {
  block_id: string;
  block_height: string;
  block_timestamp: string;
  events: {
    type: string;
    transaction_id: string;
    transaction_index: string;
    event_index: string;
    payload: string;
  }[];
};

type CadenceType = 'UInt64' | 'Array' | 'Address' | 'String' | 'UFix64';

type CadenceValueType = {
  type: CadenceType;
  value: unknown;
};

type EventPayload = {
  type: string;
  value: {
    id: string;
    fields: {
      name: string;
      value: CadenceValueType;
    }[];
  };
};

type DynamoFlowEvent<T> = T & {
  blockId: string;
  blockHeight: string;
  blockTimestamp: string;
  transactionId: string;
  eventType: string;
};
