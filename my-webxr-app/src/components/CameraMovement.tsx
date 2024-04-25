import { useFrame, useThree } from '@react-three/fiber';
import { useController, useXR } from '@react-three/xr';
import { Quaternion, Vector3 } from 'three';

/**
 * This function allow user to move the camera using the joystick on the controller in vr space.
 * Use left joystick to move forward, backward, left and right; relative to user facing direction.
 * Use right joystick to move up and down.
 */
export default function CameraMovement() {
  const { player } = useXR(); // user actual position in vr space
  const { camera } = useThree(); // camera object
  const leftController = useController('left');
  const rightController = useController('right');
  const moveSpeed = 0.05;

  useFrame(() => {
    // Move left right forward backward relative to the camera's direction
    if (leftController && leftController.inputSource?.gamepad) {
      const joyStickX = leftController.inputSource.gamepad.axes[2];
      const joyStickY = leftController.inputSource.gamepad.axes[3];

      // Create a vector from the joystick input, transform it to the camera's direction, and add
      // it to the player's position
      const joystickVector = new Vector3(joyStickX, 0, joyStickY);
      const quaternion = new Quaternion().setFromEuler(camera.rotation);
      joystickVector.applyQuaternion(quaternion);
      player.position.add(joystickVector.multiplyScalar(moveSpeed));
    }

    // move up and down, Y axis is the vertical axis in vr space
    if (rightController && rightController.inputSource?.gamepad) {
      const joyStickY = rightController.inputSource.gamepad.axes[3];
      player.position.y -= joyStickY * moveSpeed;
    }
  });
  return null;
}
