import { useState } from 'react';
import { Interactive } from '@react-three/xr';
import { Text, Html } from '@react-three/drei';
// import SelectAxesColumns from './SelectAxesMenu';
import Box from './Box';

export default function Button(props?: JSX.IntrinsicElements['mesh']) {
  const [hover, setHover] = useState(false);
  const [menu, setMenu] = useState(false);

  const onSelect = () => {
    setMenu(!menu); // Toggle menu state
  };

  return (
    <Interactive
      onSelect={onSelect}
      onHover={() => setHover(true)}
      onBlur={() => setHover(false)}
    >
      <Box
          /* An array of numbers is the preferred method of passing a Vector3 since the object
does not need to be recreated each render. TypeScript seems to not understand this in
this instance. */
          // @ts-expect-error See above comment
        scale={hover ? [1.1, 1.1, 1.1] : [1, 1, 1]}
        size={[0.3, 0.1, 0]}
        outline="black"
        position={[1, 1.56, -0.5]}
        {...props}
      >
        <Text
          position={[0, 0, 0.01]}
          fontSize={0.03}
          color="#000"
          anchorX="center"
          anchorY="middle"
        >
          Hello Everyone!
        </Text>
      </Box>
      {menu && (
        <Html position={[0, 8, -5]}>
          {/* Render SelectAxesColumns component */}
          {/* <SelectAxesColumns /> */}
        </Html>
      )}
    </Interactive>
  );
}
