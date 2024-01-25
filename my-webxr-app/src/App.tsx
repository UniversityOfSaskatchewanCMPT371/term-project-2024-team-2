import { useRef, useState } from 'react'
import { Interactive, XR, Controllers, VRButton } from '@react-three/xr'
import { Sky, Text } from '@react-three/drei'
import '@react-three/fiber'
import './styles.css'
import { Canvas, useFrame } from '@react-three/fiber'
import Floor from './Components/Floor'
import RotatingBox from './Components/RotatingBox'
import Button from './Components/Button'



export default function App() {
  return (
    <>
      <VRButton />
      <Canvas>
        <XR>
          <Sky sunPosition={[0, 1, 0]} />
          <Floor />
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <Controllers />
          <Button position={[0, 1.5, -1]} />
          <RotatingBox position={[0.8, 1.5, -1]} />
          <RotatingBox position={[-0.8, 1.5, -1]} />

        </XR>
      </Canvas>
    </>
  )
}

