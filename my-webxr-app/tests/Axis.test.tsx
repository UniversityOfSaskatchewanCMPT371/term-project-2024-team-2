import ReactThreeTestRenderer, { waitFor } from '@react-three/test-renderer';
import { Vector3 } from 'three';
import { XR } from '@react-three/xr';
import { ReactThreeTestInstance } from '@react-three/test-renderer/dist/declarations/src/createTestInstance';
import MockServer from './MockServer';
import GenerateXYZ from '../src/components/GenerateXYZ';
import SingleAxis from '../src/components/SingleAxis';

describe('Axis Tests', () => {
  beforeEach(() => MockServer.listen());

  afterEach(() => MockServer.resetHandlers());

  afterAll(() => MockServer.close());

  test('Create 3D axis with random values', async () => {
    function Element() {
      return (
        <XR>
          <GenerateXYZ
            minValue={0}
            maxValue={3}
            scaleFactor={1}
            labelOffset={1}
            startX={0}
            startY={0.82}
            startZ={-0.15}
            endPoint={1}
            radius={0.002}
          />
        </XR>
      );
    }
    const renderer = await ReactThreeTestRenderer.create(<Element />);
    // wait for scene children to be rendered
    await waitFor(() => expect(renderer.scene.children).toBeDefined());
    await waitFor(() => expect(renderer.scene.children !== null).toBeTruthy());
    await waitFor(() => expect(renderer.scene.children[1]).toBeDefined());
    await waitFor(() => expect(renderer.scene.children[1] !== null).toBeTruthy());

    // wait for the axes to be rendered
    await waitFor(() => expect(renderer.scene.children[1].children).toBeDefined());
    const axes = renderer.scene.children[1].children;
    expect(axes.length).toEqual(3);

    axes.forEach((axis: ReactThreeTestInstance) => {
      expect(axis.children).toHaveLength(22);

      // check that the axis line is present
      expect(axis.children[0].instance.name).toEqual('Axis Line');

      // check it has 21 ticks
      const ticks = axis.children.filter((e) => e.instance.name === 'tick');
      expect(ticks).toHaveLength(21);

      // check the ticks are showing correct text
      expect(ticks.map((e) => e.children[1].props.text))
        .toEqual(expect.arrayContaining(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
          '-1', '-2', '-3', '-4', '-5', '-6', '-7', '-8', '-9', '-10']));

      // check the position vector is correct
      expect(axis.children[0].instance.position.equals(new Vector3(0, 0.82, -0.15)))
        .toBeTruthy();
    });
  }, 10000);

  test('Create single axis values 0-10 and see if increment is 1', async () => {
    const renderer = await ReactThreeTestRenderer.create(
      <XR>
        <SingleAxis
          startX={0}
          startY={0.82}
          startZ={-0.15}
          endX={1}
          endY={0.82}
          endZ={-0.15}
          radius={0.002}
          labelOffset={0.2}
          scaleFactor={1}
          minValue={0}
          maxValue={5}
          axis="x"
        />
      </XR>,
    );

    await waitFor(() => expect(renderer.scene.children !== undefined).toBe(true));
    await waitFor(() => expect(renderer.scene.children[1].children !== undefined).toBe(true));

    const axis = renderer.scene.children[1];
    expect(axis.children).toHaveLength(22);

    // check that the axis line is present
    expect(axis.children[0].instance.name).toEqual('Axis Line');

    // check it has 21 ticks
    const ticks = axis.children.filter((e) => e.instance.name === 'tick');
    expect(ticks).toHaveLength(21);

    // check the ticks are showing correct text
    expect(ticks.map((e) => e.children[1].props.text))
      .toEqual(expect.arrayContaining(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
        '-1', '-2', '-3', '-4', '-5', '-6', '-7', '-8', '-9', '-10']));
  }, 10000);
});
