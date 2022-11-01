import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

const DefaultContainer = dynamic(async () => await import('@/layouts/debug/index'), {
  ssr: false,
});

const DebugContainer = dynamic(
  async () => await import('@/components/organisms/debug/send-transaction'),
  {
    ssr: false,
  },
);

const DebugPage: NextPage = (props) => (
  <DefaultContainer {...props}>
    <DebugContainer {...props} />
  </DefaultContainer>
);

export default DebugPage;
