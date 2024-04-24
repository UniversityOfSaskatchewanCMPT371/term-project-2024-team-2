import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';
// import { useController } from '@react-three/xr';

export default function CameraMovement() {
  const camera = useThree((state) => state.camera);
  // const leftController = useController('left');
  // const rightController = useController('right');
  const moveSpeed = 0.2;

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const handleKeyDown = (event) => {
      switch (event.key) {
        case 'w':
          camera.position.z -= moveSpeed;
          break;
        case 's':
          camera.position.z += moveSpeed;
          break;
        case 'a':
          camera.position.x -= moveSpeed;
          break;
        case 'd':
          camera.position.x += moveSpeed;
          break;
        case 'q':
          camera.position.y -= moveSpeed;
          break;
        case 'e':
          camera.position.y += moveSpeed;
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Cleanup function to remove the event listener when the component unmounts
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [camera, moveSpeed]);

  return null;
}
