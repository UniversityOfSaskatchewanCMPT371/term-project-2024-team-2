import ReactThreeTestRenderer, { waitFor } from '@react-three/test-renderer';
import { XR } from '@react-three/xr';
import { Vector3 } from 'three';
import MockServer from '../MockServer';
import SingleAxis from '../../src/components/SingleAxis';
import * as CreateTick from '../../src/components/CreateTick';

describe('Axis Tests', () => {
  beforeEach(() => MockServer.listen());

  afterEach(() => MockServer.resetHandlers());

  afterAll(() => MockServer.close());

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

  test.each([0.5, 1, 10])('Create single axis, given scale factor of 1, should scale correctly', async (scaleFactor : number) => {
    const createTicksSpy = vi.spyOn(CreateTick, 'default');
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
          scaleFactor={scaleFactor}
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
    // check the position vector is correct
    expect(axis.children[0].instance.position.equals(new Vector3(0, 0.82, -0.15)))
      .toBeTruthy();
    // check the length of the axis line is correctly scaled out
    expect(axis.children[0].props.geometry.parameters.height).toEqual(scaleFactor);

    // check that the CreateTicks function was called with the correct scale
    expect(createTicksSpy).toHaveBeenCalledWith(0, 0.82, -0.15, 0.2, scaleFactor, 0.002, 0, 1, 'x');
  }, 10000);
});
