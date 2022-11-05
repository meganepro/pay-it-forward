type ResponseFormat = {
  statusCode: number;
  headers: { [key in string]: string };
  body: string;
};

type ActivityApiResult = {
  fromNftId: string;
  toNftId: string;
  fromAddress: string;
  toAddress: string;
  context: string;
  transactionId: string;
  timestamp: string;
};
