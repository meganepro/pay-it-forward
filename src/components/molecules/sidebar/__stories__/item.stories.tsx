import { Story } from '@storybook/react';
import { FiHome, FiTrendingUp, FiCompass, FiStar, FiSettings } from 'react-icons/fi';
import { Sidebar, SidebarProps } from '@/components/molecules/sidebar/Sidebar';

export const Item: Story<SidebarProps> = (props) => <Sidebar {...props} />;

Item.args = {
  linkItems: [
    { name: 'Home', icon: FiHome, linkTo: '#' },
    { name: 'Trending', icon: FiTrendingUp, linkTo: '#' },
    { name: 'Explore', icon: FiCompass, linkTo: '#' },
    { name: 'Favourites', icon: FiStar, linkTo: '#' },
    { name: 'Settings', icon: FiSettings, linkTo: '#' },
  ],
};
