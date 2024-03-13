import ReactThreeTestRenderer from '@react-three/test-renderer';
import { XR } from '@react-three/xr';
import { Vector3 } from 'three';
import GenerateXYZ from '../src/components/GenerateXYZ';
// import SingleAxis from '../src/components/singleAxis';

describe('GenerateXYZ Tests', () => {
  test('Create 3D axis with random values', async () => {
    const renderer = await ReactThreeTestRenderer.create(
      <XR>
        <GenerateXYZ
          minValue={0}
          maxValue={10}
          scaleFactor={1}
          labelOffset={0.1}
          startX={0}
          startY={0.82}
          startZ={-0.15}
          endPoint={1}
          radius={0.002}
        />
      </XR>,
    );
    // check the position of the axis vector is correct
    expect(renderer.scene.children[1].instance.position).toEqual(
      new Vector3(0, 0.82, -0.15),
    );
  });

  // test("Create single axis values 0-10 and see if increment is 1", async () => {
  //     const renderer = await ReactThreeTestRenderer.create(
  //         <XR>
  //             <SingleAxis startX={0} startY={0.82} startZ={-0.15}
  //                         endX={1} endY={0.82} endZ={-0.15}
  //                         radius={0.002}
  //                         labelOffset={0.1}
  //                         scaleFactor={1}
  //                         minValue={0}
  //                         maxValue={10} labelIncrement={0}></SingleAxis>
  //         </XR>
  //     )
  //
  //     // check the position vector is correct
  //     // expect(renderer.scene.children[1].children[0].instance.position).toEqual(
  //     new Vector3(0, 0.82, -0.15)
  //     )
  // console.log(renderer.scene.children[1].children);
  // })
});
