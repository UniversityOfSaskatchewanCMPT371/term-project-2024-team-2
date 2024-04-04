/**
 * Creates the world floor of the VR space
 * @pre-condition None
 * @post-condition Returns a VR element that is the floor of the world space
 * @return {JSX.Element} a VR element that is the floor of hte world space
 * @constructor
 */
export default function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="gray" />
    </mesh>
  );
}
