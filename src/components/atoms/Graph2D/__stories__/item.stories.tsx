import { Story } from '@storybook/react';
import miserables from '../../miserables';
import { Graph2D, Graph2DProps } from '@/components/atoms/Graph2D';

export const Item: Story<Graph2DProps> = (props) => <Graph2D {...props} />;

Item.args = {
  graphData: miserables,
  // linkColorBy: 'group',
  linkWeightKey: 'value',
  nodeLabel: 'id',
  nodeColorBy: 'group',
  nodeWeightKey: undefined,
  nodeType: 'particular',
  showLinkText: false,
  linkWeightAsParticle: true,
};
