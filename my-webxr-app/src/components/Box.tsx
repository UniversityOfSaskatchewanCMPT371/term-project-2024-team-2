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

Box.defaultProps = {
  children: [],
  rest: {},
};
