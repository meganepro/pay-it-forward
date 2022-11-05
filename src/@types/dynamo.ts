type PayItForwardPayload = {
  fromNftId: number;
  toNftIds: number[];
  from: string;
  to: string;
  context: string;
  timestamp: number;
};
type DynamoPayItForward = {
  fromNftId: number;
  toNftId: number;
  fromAddress: string;
  toAddress: string;
  context: string;
  timestamp: number;
};

export {};
