import { Meta } from '@storybook/react';
import { Graph3D } from '@/components/atoms/Graph3D';

const meta: Meta = {
  title: 'Atoms/Graph3D',
  component: Graph3D,
  argTypes: {
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
  },
};

export * from './item.stories';

export default meta;
