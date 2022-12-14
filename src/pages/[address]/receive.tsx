import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React from 'react';

const DefaultContainer = dynamic(async () => await import('@/layouts/default/index'), {
  ssr: false,
});

const ReceiveContainer = dynamic(
  async () => await import('@/components/organisms/receive/Receive'),
  {
    ssr: false,
  },
);

const ReceivePage: NextPage = (props) => {
  const router = useRouter();
  // パスパラメータから値を取得
  let { address } = router.query;
  address = typeof address === 'string' ? address : undefined;

  return (
    <DefaultContainer {...props}>
      <ReceiveContainer {...{ ...props, pathAddress: address }} />
    </DefaultContainer>
  );
};

export default ReceivePage;
