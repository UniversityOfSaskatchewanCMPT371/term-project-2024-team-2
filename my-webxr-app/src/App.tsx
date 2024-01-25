import { useRef, useState } from 'react'
import { Interactive, XR, Controllers, VRButton } from '@react-three/xr'
import { Sky, Text } from '@react-three/drei'
import '@react-three/fiber'
import './styles.css'
import { Canvas, useFrame } from '@react-three/fiber'


//creating a floor, all it is is a plane with a color
function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="#72b2f4" />
    </mesh>
  )
}

//creating rotation boxes that accepts props to be used in the canvas
//the useFrame hook is used to rotate the box
//the Interactive component is used to make the box interactable

function RotatingBox(props: JSX.IntrinsicElements['mesh']) {
  const ref = useRef<THREE.Mesh>(null!)
  const [hovered, hover] = useState(false)
  const [clicked, click] = useState(false)
  useFrame((state, delta) => (ref.current.rotation.x += 0.01))

  return (
    <Interactive onSelect={() => click(!clicked)} onHover={()=>hover(!hovered)} >
      <mesh
        {...props}
        ref={ref}
        scale={clicked ? .5 : .8}>
        <boxGeometry args={[.5, .5, .5]} />
        <meshStandardMaterial color={hovered ? 'hotpink' : 'blue'} />
      </mesh>
    </Interactive>
  )
}

//creating a box that accepts props to be used in the canvas
// can surround other things in this to creat things like text boxes/menus 
function Box({ color, size, scale, children, ...rest }: any) {
  return (
    <mesh scale={scale} {...rest}>
      <boxGeometry args={size} />
      <meshPhongMaterial color={color} />
      {children}
    </mesh>
  )
}

//creating a button that accepts props to be used in the canvas
//the Interactive component is used to make the box interactable
//the useState hook is used to change the color of the box
//the useState hook is used to change the scale of the box
// taken from the Webxr example 
function Button(props: any) {
  const [hover, setHover] = useState(false)
  const [color, setColor] = useState(0x123456)

  
  const onSelect = () => {
    console.log("This button is interactable and has been clicked!")
    setColor((Math.random() * 0xffffff) | 0)
  }

  return (
    <Interactive onSelect={onSelect} onHover={() => setHover(true)} onBlur={() => setHover(false)}>
      <Box color={color} scale={hover ? [2.5, 2.5, 2.5] : [1, 1, 1]} size={[0.4, 0.1, 0.1]} {...props}>
        <Text position={[0, 0, 0.06]} fontSize={0.05} color="#000" anchorX="center" anchorY="middle">
          Hello Everyone!
        </Text>
      </Box>
    </Interactive>
  )
}

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

