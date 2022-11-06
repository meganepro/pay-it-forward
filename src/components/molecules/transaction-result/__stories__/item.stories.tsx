import { Story } from '@storybook/react';
import TransactionResultCard from '@/components/molecules/transaction-result/TransactionResult';

export const Item: Story<Transaction> = (props) => <TransactionResultCard {...props} />;

Item.args = {
  fromNftId: 'id',
  toNftId: 'originalNftId',
  fromAddress: '0xf8d6e0586b0a20c7',
  toAddress: '0xf8d6e0586b0a20c7',
  transactionId: '0xf8d6e0586b0a20c7',
  context: 'ancestor nft',
  timestamp: 1667446293,
};
