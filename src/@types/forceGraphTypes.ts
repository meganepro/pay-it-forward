import { LinkObject } from 'react-force-graph-3d';

// Node Type
export type NodeType = {
  id: string;
  group: string | number;
  text?: string;
  imgSrc?: string;
};
export type ColoredNodeType = NodeType & { color: string };

// Node Type Guard
export const isNode = (arg: unknown): arg is NodeType =>
  typeof arg === 'object' &&
  arg != null &&
  typeof (arg as NodeType).id === 'string' &&
  ['string', 'number'].includes(typeof (arg as ColoredNodeType).group) &&
  ((arg as NodeType).text === null || typeof (arg as NodeType).id === 'string');

export const isColoredNode = (arg: unknown): arg is ColoredNodeType =>
  arg != null && isNode(arg) && typeof (arg as ColoredNodeType).color === 'string';

// Link Type
export type LinkType = { source: string; target: string; value?: number };
export type LinkValuedType = LinkType & { value: number };
export type LinkValuedObjectType = LinkObject & { value: number };

// Link Type Guard
export const isLink = (arg: unknown): arg is LinkType =>
  typeof arg === 'object' &&
  arg != null &&
  typeof (arg as LinkType).source === 'string' &&
  typeof (arg as LinkType).target === 'string' &&
  ((arg as LinkType).value === null || typeof (arg as LinkType).value === 'number');

export const isLinkValuedObject = (arg: unknown): arg is LinkValuedObjectType =>
  typeof arg === 'object' &&
  arg != null &&
  typeof (arg as LinkValuedObjectType).source === 'object' &&
  typeof (arg as LinkValuedObjectType).target === 'object' &&
  typeof (arg as LinkValuedObjectType).value === 'number';

// Graph Data Type
export type GraphType = {
  nodes: NodeType[];
  links: LinkType[];
};

export const isGraphType = (arg: unknown): arg is GraphType =>
  typeof arg === 'object' &&
  arg != null &&
  Array.isArray((arg as GraphType).nodes) &&
  (arg as GraphType).nodes.every(isNode) &&
  Array.isArray((arg as GraphType).links) &&
  (arg as GraphType).links.every(isLink);

// const isLinkValued = (arg: unknown): arg is LinkValuedType =>
//   isLink(arg) && typeof (arg as LinkValuedType).value === 'number'
export type Coords2D = { x: number; y: number; z: number };
export type Coords3D = Coords2D & { z: number };

export const isCoords2D = (arg: unknown): arg is Coords2D =>
  typeof arg === 'object' &&
  arg != null &&
  typeof (arg as Coords2D).x === 'number' &&
  typeof (arg as Coords2D).y === 'number';

export const isCoords3D = (arg: unknown): arg is Coords3D =>
  isCoords2D(arg) && typeof (arg as Coords3D).z === 'number';
