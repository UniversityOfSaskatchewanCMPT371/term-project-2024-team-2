import React, { useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { useXREvent } from '@react-three/xr';
import { Mesh } from 'three';
import * as THREE from 'three';

const InteractiveButton: React.FC = () => {
  const ref = useRef<Mesh>(null); // Provide initial value
  const { scene } = useThree();

  useXREvent('select', () => {
    const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
    const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const box = new THREE.Mesh(boxGeometry, boxMaterial);
    box.position.set(Math.random() * 2 - 1, Math.random() * 2 - 1, -3);
    scene.add(box);
  }, { handedness: 'right' });

  return (
    <mesh ref={ref}>
      <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
      <meshBasicMaterial attach="material" color="red" />
    </mesh>
  );
};

export default InteractiveButton;
