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
    // Justifiable argument for prop spreading here, since there are a large number of possible
    // mesh props
    // eslint-disable-next-line react/jsx-props-no-spreading
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
