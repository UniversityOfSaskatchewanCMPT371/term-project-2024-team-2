// creating a box that accepts props to be used in the canvas
// can surround other things in this to creat things like text boxes/menus
export default function Box({
  color, size, scale, children, ...rest
}: any) {
  return (
    <mesh scale={scale} {...rest}>
      <boxGeometry args={size} />
      <meshPhongMaterial color={color} />
      {children}
    </mesh>
  );
}
