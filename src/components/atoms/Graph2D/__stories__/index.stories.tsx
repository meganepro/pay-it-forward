import { Meta } from '@storybook/react';
import { Graph2D } from '@/components/atoms/Graph2D';

const meta: Meta = {
  title: 'Atoms/Graph2D',
  component: Graph2D,
  argTypes: {
    linkColorBy: {
      options: ['source', 'target', 'value', undefined],
      control: { type: 'select' },
      table: { disable: true },
    },
    linkWeightKey: {
      options: ['value', undefined],
      control: { type: 'select' },
      table: { disable: true },
    },
    nodeLabel: {
      options: ['id', 'text'],
      control: { type: 'select' },
    },
    nodeColorBy: {
      options: ['id', 'group', 'text', undefined],
      control: { type: 'select' },
      table: { disable: true },
    },
    nodeWeightKey: {
      options: ['weight', undefined],
      control: { type: 'select' },
      table: { disable: true },
    },
    showLinkText: {
      table: { disable: true },
    },
    linkWeightAsParticle: {
      options: [true, false],
      control: { type: 'select' },
    },
    nodeType: {
      options: ['text', 'image', 'particular'],
      control: { type: 'select' },
    },
  },
};

export { Item } from './item.stories';

export default meta;
