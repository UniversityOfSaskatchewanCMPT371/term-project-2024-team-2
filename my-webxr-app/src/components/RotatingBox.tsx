import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Interactive } from '@react-three/xr';
import * as THREE from 'three';

// the useState hook is used to change the color of the box
// the useState hook is used to change the scale of the box
// taken from the React-three-fiber example and modified
export default function RotatingBox(props: JSX.IntrinsicElements['mesh']) {
  const ref = useRef<THREE.Mesh>(null!);
  const [hovered, hover] = useState(false);
  const [clicked, click] = useState(false);
  useFrame(() => {
    ref.current.rotation.x += 0.01;
  });

  return (
    <Interactive onSelect={() => click(!clicked)} onHover={() => hover(!hovered)}>
      <mesh
        {...props}
        ref={ref}
        scale={clicked ? 0.5 : 0.8}
      >
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color={hovered ? 'hotpink' : 'blue'} />
      </mesh>
    </Interactive>
  );
}
