/** @jest-environment jsdom */
import ReactThreeTestRenderer from '@react-three/test-renderer';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'jest-canvas-mock';
import { XR } from '@react-three/xr';
import { Vector3 } from 'three';
import Axis from '../src/components/Axis';
// import {newServer} from 'mock-xmlhttprequest';
// import SingleAxis from '../src/components/SingleAxis';

beforeAll(() => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  global.IS_REACT_ACT_ENVIRONMENT = true;
});

describe('Axis Tests', () => {
  test('Create 3D axis with random values', async () => {
    const renderer = await ReactThreeTestRenderer.create(
      <XR>
        <Axis
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
    // check the position vector is correct
    expect(renderer.scene.children[1].children[0].instance.position).toEqual(
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
