

// just creates a floor for the scene
export default function Floor() {
    return (
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#72b2f4" />
      </mesh>
    )
  }