import { Story } from '@storybook/react';
import miserables from '../../miserables';
import { Graph3D, Graph3DProps } from '@/components/atoms/Graph3D';

export const Template: Story<Graph3DProps> = (props) => <Graph3D {...props} />;

Template.args = {
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

export const TextNode01SimpleColor = Template.bind({});
TextNode01SimpleColor.args = {
  graphData: miserables,
  linkColorBy: undefined,
  linkWeightKey: undefined,
  nodeLabel: 'id',
  nodeColorBy: undefined,
  nodeWeightKey: undefined,
  nodeType: 'text',
  linkWeightAsParticle: false,
};
export const TextNode02ColoredNodeById = Template.bind({});
TextNode02ColoredNodeById.args = {
  graphData: miserables,
  linkColorBy: undefined,
  linkWeightKey: undefined,
  nodeLabel: 'id',
  nodeColorBy: 'id',
  nodeWeightKey: undefined,
  nodeType: 'text',
  linkWeightAsParticle: false,
};
export const TextNode03ColoredNodeByGroup = Template.bind({});
TextNode03ColoredNodeByGroup.args = {
  graphData: miserables,
  linkColorBy: undefined,
  linkWeightKey: undefined,
  nodeLabel: 'id',
  nodeColorBy: 'group',
  nodeWeightKey: undefined,
  nodeType: 'text',
  linkWeightAsParticle: false,
};
export const TextNode04ColoredLinkBySource = Template.bind({});
TextNode04ColoredLinkBySource.args = {
  graphData: miserables,
  linkColorBy: 'source',
  linkWeightKey: undefined,
  nodeLabel: 'id',
  nodeColorBy: 'group',
  nodeWeightKey: undefined,
  nodeType: 'text',
  linkWeightAsParticle: false,
};
export const TextNode05LineWidthByValue = Template.bind({});
TextNode05LineWidthByValue.args = {
  graphData: miserables,
  linkColorBy: 'source',
  linkWeightKey: 'value',
  nodeLabel: 'id',
  nodeColorBy: 'group',
  nodeWeightKey: undefined,
  nodeType: 'text',
  linkWeightAsParticle: false,
};
export const TextNode06WithImage = Template.bind({});
TextNode06WithImage.args = {
  graphData: miserables,
  linkColorBy: 'source',
  linkWeightKey: 'value',
  nodeLabel: 'id',
  nodeColorBy: 'group',
  nodeWeightKey: undefined,
  nodeType: 'text',
  linkWeightAsParticle: false,
};
export const TextNode07LinkText = Template.bind({});
TextNode07LinkText.args = {
  graphData: miserables,
  linkColorBy: 'source',
  linkWeightKey: 'value',
  nodeLabel: 'id',
  nodeColorBy: 'group',
  nodeWeightKey: undefined,
  nodeType: 'text',
  showLinkText: true,
  linkWeightAsParticle: false,
};
export const CircleNode01 = Template.bind({});
CircleNode01.args = {
  graphData: miserables,
  linkColorBy: 'source',
  linkWeightKey: 'value',
  nodeLabel: 'id',
  nodeColorBy: 'group',
  nodeWeightKey: undefined,
  nodeType: 'particular',
  showLinkText: false,
  linkWeightAsParticle: true,
};
