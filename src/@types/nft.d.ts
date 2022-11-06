type Nft = {
  id: string;
  originalNftId: string;
  gifter: string;
  giftee?: string;
  context: string;
  createdAt: string;
};

type Transaction = {
  fromAddress: string;
  toAddress: string;
  fromNftId: string;
  toNftId: string;
  context: string;
  timestamp: number;
  transactionId: string;
};
