import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

const DefaultContainer = dynamic(async () => await import('@/layouts/default/index'), {
  ssr: false,
});

const DebugContainer = dynamic(
  async () => await import('@/components/organisms/debug/deploy-contract'),
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
