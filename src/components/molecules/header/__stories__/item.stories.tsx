import { Story } from '@storybook/react';
import { MouseEvent } from 'react';
import { Header, HeaderProps } from '@/components/molecules/header';

export const Item: Story<HeaderProps> = (props) => <Header {...props} />;

Item.args = {
  loggedIn: false,
  // eslint-disable-next-line @typescript-eslint/require-await
  signInOrOut: async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    alert('clicked.');
  },
};
