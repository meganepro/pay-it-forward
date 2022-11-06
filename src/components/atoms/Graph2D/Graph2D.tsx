import { useCallback, useState, useRef, FC } from 'react';
import ForceGraph2D, { ForceGraphMethods, NodeObject, LinkObject } from 'react-force-graph-2d';
import { Sprite, CanvasTexture, SpriteMaterial } from 'three';
import SpriteText from 'three-spritetext';
import {
  GraphType,
  isColoredNode,
  isNode,
  isLink,
  isCoords2D,
  isLinkValuedObject,
} from '@/@types/forceGraphTypes';

export type Graph2DProps = {
  graphData: GraphType;
  linkColorBy: 'source' | 'target' | 'value' | undefined;
  linkWeightKey: 'value' | undefined;
  linkWeightAsParticle?: boolean;
  nodeLabel: 'id' | 'text';
  nodeColorBy: 'id' | 'group' | 'text' | undefined;
  nodeWeightKey: 'weight' | undefined;
  nodeType?: 'text' | 'particular' | 'image';
  showLinkText?: boolean;
};

const NODE_R = 8;
export const Graph2D: FC<Graph2DProps> = (props) => {
  const {
    graphData,
    linkColorBy,
    linkWeightKey,
    nodeLabel,
    nodeColorBy,
    nodeWeightKey,
    nodeType = 'text',
    showLinkText = false,
    linkWeightAsParticle = false,
  } = props;
  const [highlightNodes, setHighlightNodes] = useState(new Set());
  const [highlightLinks, setHighlightLinks] = useState(new Set());
  const [hoverNode, setHoverNode] = useState<NodeObject | null>(null);
  const graph2DRef = useRef<ForceGraphMethods | undefined>(undefined);
  // create circle node
  const drawCircle = useCallback(() => {
    const canvas = document.createElement('canvas');
    canvas.id = 'canvas';
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    const PI2 = Math.PI * 2;
    if (ctx) {
      ctx.arc(16, 16, 16, 0, PI2, true);
      ctx.fillStyle = 'yellow';
      ctx.createRadialGradient(0, 0, 0, 1, 1, 1);
      ctx.fill();
    }

    return canvas;
  }, []);
  // create Node
  const drawNode = useCallback(
    (node: NodeObject, ctx: CanvasRenderingContext2D, globalScale: number) => {
      // image
      if (isNode(node)) {
        const R = nodeType === 'particular' ? NODE_R * 1.5 : NODE_R;
        if (isCoords2D(node)) {
          if (highlightNodes.has(node)) {
            ctx.beginPath();
            ctx.arc(node.x, node.y, R * 1.4, 0, 2 * Math.PI, false);
            ctx.fillStyle = node === hoverNode ? 'red' : 'orange';
            ctx.fill();
          } else if (isColoredNode(node)) {
            ctx.beginPath();
            ctx.arc(node.x, node.y, R, 0, 2 * Math.PI, false);
            ctx.fillStyle = node.color;
            ctx.fill();
          }
        }
        if (nodeType === 'image' && node.imgSrc && isCoords2D(node)) {
          const img = new Image();
          img.src = node.imgSrc;
          const size = 12;
          ctx.drawImage(img, node.x - size / 2, node.y - size / 2, size, size);

          return node;
        }
        if ((nodeType === 'image' && !node.imgSrc) || nodeType === 'text') {
          // text
          const label = node.id;
          const fontSize = 12 / globalScale;
          ctx.font = `${fontSize}px Sans-Serif`;
          const textWidth = ctx.measureText(label).width;
          const bckgDimensions: [number, number] = [
            textWidth + fontSize * 0.2,
            fontSize + fontSize * 0.2,
          ];

          if (isColoredNode(node) && isCoords2D(node)) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.fillRect(
              node.x - bckgDimensions[0] / 2,
              node.y - bckgDimensions[1] / 2,
              ...bckgDimensions,
            );

            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = node.color;
            ctx.fillText(label, node.x, node.y);
          }

          // eslint-disable-next-line no-param-reassign, no-underscore-dangle
          // node.__bckgDimensions = bckgDimensions // to re-use in nodePointerAreaPaint
          return node;
        }
      }
      // normal
      const imageTexture = new CanvasTexture(drawCircle());
      imageTexture.needsUpdate = true;
      const material = new SpriteMaterial({
        map: imageTexture,
        transparent: true,
      });
      const sprite = new Sprite(material);
      sprite.scale.set(16, 16, 16);

      return sprite;
    },
    [drawCircle, nodeType, highlightNodes, hoverNode],
  );
  // create Link Object
  const drawLink = useCallback((link: LinkObject) => {
    // extend link with text sprite
    if (isLink(link)) {
      const sprite = new SpriteText(`${link.source} > ${link.target}`);
      sprite.color = 'lightgrey';
      sprite.textHeight = 1.5;

      return sprite;
    }

    return new Sprite();
  }, []);

  const updateHighlight = () => {
    setHighlightNodes(highlightNodes);
    setHighlightLinks(highlightLinks);
  };

  const handleNodeHover = (node: NodeObject) => {
    highlightNodes.clear();
    highlightLinks.clear();
    if (node) {
      highlightNodes.add(node);
      // node.neighbors.forEach((neighbor) => highlightNodes.add(neighbor))
      // node.links.forEach((link) => highlightLinks.add(link))
    }

    setHoverNode(node || null);
    updateHighlight();
  };

  const handleLinkHover = (link: LinkObject) => {
    highlightNodes.clear();
    highlightLinks.clear();

    if (link) {
      highlightLinks.add(link);
      highlightNodes.add(link.source);
      highlightNodes.add(link.target);
    }

    updateHighlight();
  };

  return (
    <ForceGraph2D
      ref={graph2DRef}
      graphData={graphData}
      nodeRelSize={NODE_R}
      nodeLabel={nodeLabel}
      nodeAutoColorBy={nodeColorBy}
      nodeVal={nodeWeightKey}
      nodeCanvasObject={(node, ctx, globalScale) => {
        drawNode(node, ctx, globalScale);
      }}
      nodeCanvasObjectMode={(node) => (highlightNodes.has(node) ? 'after' : 'replace')}
      // onNodeClick={(node) => (isCoords(node) ? handleClick(node) : undefined)}
      linkWidth={!linkWeightAsParticle ? linkWeightKey ?? 1 : 1}
      linkDirectionalParticles={linkWeightAsParticle ? linkWeightKey ?? 1 : undefined}
      linkDirectionalParticleWidth={linkWeightAsParticle ? 2 : undefined}
      linkDirectionalParticleSpeed={(d) => (isLinkValuedObject(d) ? d.value * 0.001 : 0.001)}
      linkAutoColorBy={linkColorBy}
      linkCanvasObject={!showLinkText ? undefined : (link) => drawLink(link)}
      onNodeHover={(node) => (node ? handleNodeHover(node) : null)}
      onLinkHover={(link) => (link ? handleLinkHover(link) : null)}
    />
  );
};
