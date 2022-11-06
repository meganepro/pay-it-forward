/* eslint-disable no-nested-ternary */
import { useCallback, useRef, FC } from 'react';
import ForceGraph3D, {
  ForceGraphMethods,
  NodeObject,
  LinkObject,
  ForceGraphProps,
} from 'react-force-graph-3d';
import { Sprite, CanvasTexture, SpriteMaterial, TextureLoader, Object3D } from 'three';
import SpriteText from 'three-spritetext';
import {
  GraphType,
  isColoredNode,
  isNode,
  isLink,
  Coords3D,
  isCoords3D,
  isLinkValuedObject,
} from '@/@types/forceGraphTypes';

export type Graph3DProps = ForceGraphProps & {
  graphData: GraphType;
  contextList?: { [key in string]: string };
  linkColorBy: 'source' | 'target' | 'value' | undefined;
  linkWeightKey: 'value' | undefined;
  linkWeightAsParticle?: boolean;
  nodeLabel: 'id' | 'text' | 'group';
  nodeColorBy: 'id' | 'group' | 'text' | undefined;
  nodeWeightKey: 'weight' | undefined;
  nodeType?: 'text' | 'particular' | 'image';
  showLinkText?: boolean;
};

export const Graph3D: FC<Graph3DProps> = (props) => {
  const {
    graphData,
    contextList = {},
    linkColorBy,
    linkWeightKey,
    nodeLabel,
    nodeColorBy,
    nodeWeightKey,
    nodeType = 'text',
    showLinkText = false,
    linkWeightAsParticle = false,
    ...rest
  } = props;
  const graph3DRef = useRef<ForceGraphMethods | undefined>(undefined);
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
  // 関数のメモ化
  const isColored = useCallback(isColoredNode, []);
  // create Node
  const drawNode = useCallback(
    (node: NodeObject) => {
      // image
      if (isNode(node)) {
        if (nodeType === 'image' && node.imgSrc) {
          const textureLoader = new TextureLoader();
          textureLoader.setCrossOrigin('');
          const texture = textureLoader.load(node.imgSrc);
          const material = new SpriteMaterial({ map: texture });
          const sprite = new Sprite(material);
          sprite.scale.set(12, 12, 12);

          return sprite;
        }
        if ((nodeType === 'image' && !node.imgSrc) || nodeType === 'text') {
          // text
          const sprite = new SpriteText(
            nodeLabel === 'id'
              ? node.id
              : nodeLabel === 'text'
              ? node.text
              : nodeLabel === 'group'
              ? node.group.toString()
              : 'no_name',
          );
          sprite.textHeight = 8;
          sprite.color = isColored(node) ? node.color : 'white';

          return sprite;
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
    [drawCircle, isColored, nodeLabel, nodeType],
  );
  // create Link Object
  const drawLink = useCallback(
    (link: LinkObject) => {
      // extend link with text sprite
      if (isLink(link)) {
        const sprite = contextList
          ? new SpriteText(contextList[link.source])
          : new SpriteText(`${link.source} > ${link.target}`);
        sprite.color = 'lightgrey';
        sprite.textHeight = 4;

        return sprite;
      }

      return new Sprite();
    },
    [contextList],
  );
  // calc middle postion
  const calcMiddlePostion = useCallback((sprite: Object3D, start: Coords3D, end: Coords3D) => {
    const keys = ['x', 'y', 'z'] as const;
    const middlePos: { [k in typeof keys[number]]?: number } = {};
    keys.forEach((c) => {
      middlePos[c] = start[c] + (end[c] - start[c]) / 2; // calc middle point
    });

    Object.assign(sprite.position, middlePos);

    return null;
  }, []);
  // click forcus
  const handleClick = useCallback(
    (node: Coords3D) => {
      // Aim at node from outside it
      const distance = 100;
      if (node.x === undefined || node.y === undefined || node.z === undefined) {
        return;
      }
      const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);
      if (graph3DRef.current) {
        graph3DRef.current.cameraPosition(
          {
            x: node.x * distRatio,
            y: node.y * distRatio,
            z: node.z * distRatio,
          }, // new position
          node, // lookAt ({ x, y, z })
          3000, // ms transition duration
        );
      }
    },
    [graph3DRef],
  );

  return (
    <ForceGraph3D
      ref={graph3DRef}
      graphData={graphData}
      nodeLabel={nodeLabel}
      nodeAutoColorBy={nodeColorBy}
      nodeVal={nodeWeightKey}
      nodeThreeObject={nodeType === 'particular' ? undefined : (node) => drawNode(node)}
      onNodeClick={(node) => (isCoords3D(node) ? handleClick(node) : undefined)}
      linkWidth={!linkWeightAsParticle ? linkWeightKey ?? 1 : 1}
      linkDirectionalParticles={linkWeightAsParticle ? linkWeightKey ?? 1 : undefined}
      linkDirectionalParticleWidth={linkWeightAsParticle ? 2 : undefined}
      linkDirectionalParticleSpeed={(d) => (isLinkValuedObject(d) ? d.value * 0.001 : 0.001)}
      linkAutoColorBy={linkColorBy}
      linkThreeObjectExtend={showLinkText}
      linkThreeObject={!showLinkText ? undefined : (link) => drawLink(link)}
      linkPositionUpdate={(sprite, { start, end }, _) => calcMiddlePostion(sprite, start, end)}
      {...rest}
    />
  );
};
