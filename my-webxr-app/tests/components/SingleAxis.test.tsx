import ReactThreeTestRenderer, { waitFor } from '@react-three/test-renderer';
import { XR } from '@react-three/xr';
import MockServer from '../MockServer';
import SingleAxis from '../../src/components/SingleAxis';

describe('Axis Tests', () => {
  beforeEach(() => MockServer.listen());

  afterEach(() => MockServer.resetHandlers());

  afterAll(() => MockServer.close());

  test('Single axis, max value 20, 21 tick each tick is 2 away from other', async () => {
    const renderer = await ReactThreeTestRenderer.create(
      <XR>
        <SingleAxis
          startX={0}
          startY={0}
          startZ={0}
          endX={1}
          endY={1}
          endZ={1}
          radius={0.002}
          labelOffset={0.2}
          scaleFactor={1}
          maxValue={20}
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
      .toEqual([-20, -18, -16, -14, -12, -10, -8, -6, -4, -2, 0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20]
        .map(String));
  }, 10000);

  test('Single axis, max value 10, 21 tick each tick is 1 away from other', async () => {
    const renderer = await ReactThreeTestRenderer.create(
      <XR>
        <SingleAxis
          startX={0}
          startY={0}
          startZ={0}
          endX={1}
          endY={1}
          endZ={1}
          radius={0.002}
          labelOffset={0.2}
          scaleFactor={1}
          maxValue={10}
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
      .toEqual([-10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        .map(String));
  }, 10000);

  test('Single axis, max value 0.1, 21 tick each tick is 0.01 away from other', async () => {
    const renderer = await ReactThreeTestRenderer.create(
      <XR>
        <SingleAxis
          startX={0}
          startY={0}
          startZ={0}
          endX={1}
          endY={1}
          endZ={1}
          radius={0.002}
          labelOffset={0.2}
          scaleFactor={1}
          maxValue={0.1}
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
      .toEqual([-0.1, -0.09, -0.08, -0.07, -0.06, -0.05, -0.04, -0.03, -0.02, -0.01, 0,
        0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.07, 0.08, 0.09, 0.1]
        .map(String));
  }, 10000);
});
