import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

const DefaultContainer = dynamic(async () => await import('@/layouts/default/index'), {
  ssr: false,
});

const HomeContainer = dynamic(async () => await import('@/components/organisms/home/Home'), {
  ssr: false,
});

const HomePage: NextPage = (props) => (
  <DefaultContainer {...props}>
    <HomeContainer {...props} />
  </DefaultContainer>
);

export default HomePage;
