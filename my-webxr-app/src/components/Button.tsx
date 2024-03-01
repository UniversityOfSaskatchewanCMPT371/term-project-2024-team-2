import { useState } from 'react';
import { Interactive } from '@react-three/xr';
import { Text } from '@react-three/drei';
import Box from './Box';

// the useState hook is used to change the color of the box
// the useState hook is used to change the scale of the box
// taken from the Webxr example
export default function Button(props?: JSX.IntrinsicElements['mesh']) {
  const [hover, setHover] = useState(false);
  const [color, setColor] = useState(0x123456);

  const onSelect = () => {
    // eslint-disable-next-line no-console
    console.log('This button is interactable and has been clicked!');
    setColor(Math.floor(Math.random() * 0xffffff));
  };

  return (
    <Interactive
      onSelect={onSelect}
      onHover={() => setHover(true)}
      onBlur={() => setHover(false)}
    >
      <Box
        color={color}
        /* An array of numbers is the preferred method of passing a Vector3 since the object
         does not need to be recreated each render. TypeScript seems to not understand this in
          this instance. */
        // @ts-expect-error See above comment
        scale={hover ? [2.5, 2.5, 2.5] : [1, 1, 1]}
        size={[0.4, 0.1, 0.1]}
        {...props}
      >
        <Text
          position={[0, 0, 0.06]}
          fontSize={0.05}
          color="#000"
          anchorX="center"
          anchorY="middle"
        >
          Hello Everyone!
        </Text>
      </Box>
    </Interactive>
  );
}
