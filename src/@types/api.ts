export type ResponseFormat = {
  statusCode: number;
  headers: { [key in string]: string };
  body: string;
};

export type ActivityApiResult = {
  fromNftId: string;
  toNftId: string;
  fromAddress: string;
  toAddress: string;
  context: string;
  transactionId: string;
  timestamp: string;
};
