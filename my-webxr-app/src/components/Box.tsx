// creating a box that accepts props to be used in the canvas
// can surround other things in this to creat things like text boxes/menus

import { BoxGeometryProps } from '@react-three/fiber';
import THREE from 'three';

type BoxProps = {
  color: THREE.Color | number;
  size: BoxGeometryProps['args'];
  scale: [number, number, number];
  children?: JSX.Element;
  rest?: JSX.IntrinsicElements['mesh'];
};
/**
 * Returns a Box react element
 * @pre-condition None
 * @post-condition A box geometry for use in VR
 * @param {Color | number} color
 * @param {[width: number | undefined, height: number | undefined, depth: number | undefined,
 *    widthSegments: number | undefined, heightSegments: number | undefined,
 *    depthSegments: number | undefined] | undefined} size the size props for the box
 * @param {[number, number, number]} scale the world scale of the box
 * @param {JSX.Element | undefined} children child elements of the box
 * @param {Omit<BoxProps, "scale" | "color" | "size" | "children"> | undefined} rest
 *    other parameters
 * @return {JSX.Element} a box geometry with a material applied
 * @constructor
 */
export default function Box({
  color, size, scale, children, ...rest
}: BoxProps) {
  return (
    <mesh scale={scale} {...rest}>
      <boxGeometry args={size} />
      <meshPhongMaterial color={color} />
      {children}
    </mesh>
  );
}

Box.defaultProps = {
  children: [],
  rest: {},
};
