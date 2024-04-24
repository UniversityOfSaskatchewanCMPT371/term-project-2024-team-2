import { useFrame } from '@react-three/fiber';
import { useController, useXR } from '@react-three/xr';

/**
 * This function allow user to move the camera using the joystick on the controller in vr space.
 * Use left joystick to move forward, backward, left and right.
 * Use right joystick to move up and down.
 */
export default function CameraMovement() {
  const { player } = useXR();
  const leftController = useController('left');
  const rightController = useController('right');
  const moveSpeed = 0.05;

  useFrame(() => {
    if (leftController && leftController.inputSource?.gamepad) {
      const joyStickX = leftController.inputSource.gamepad.axes[2];
      const joyStickY = leftController.inputSource.gamepad.axes[3];
      player.position.x += joyStickX * moveSpeed;
      player.position.z += joyStickY * moveSpeed;
    }
    if (rightController && rightController.inputSource?.gamepad) {
      const joyStickY = rightController.inputSource.gamepad.axes[3];
      player.position.y -= joyStickY * moveSpeed;
    }
  });
  return null;
}
