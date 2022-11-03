import { Story } from '@storybook/react';
import NftCard from '@/components/molecules/nft-card/NftCard';

export const Item: Story<Nft> = (props) => <NftCard {...props} />;

Item.args = {
  id: 'id',
  originalNftId: 'originalNftId',
  gifter: '0xf8d6e0586b0a20c7',
  giftee: '0xf8d6e0586b0a20c7',
  context: 'ancestor nft',
  createdAt: '1667446293.00000000',
};
