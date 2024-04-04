import ReactThreeTestRenderer, { waitFor } from '@react-three/test-renderer';
import { Vector3 } from 'three';
import GenerateTick from '../../src/components/GenerateTick';
import MockServer from '../MockServer';

describe('GenerateTick Component Tests', () => {
  beforeEach(() => MockServer.listen());

  afterEach(() => MockServer.resetHandlers());

  afterAll(() => MockServer.close());

  test.each([['x', new Vector3(0.5, 0, 0), new Vector3(0.5, -0.02, 0)],
    ['y', new Vector3(0, 0.5, 0), new Vector3(0.03, 0.5, 0)],
    ['z', new Vector3(0, 0, 0.5), new Vector3(0, -0.02, 0.5)]])(
    'expect.soft Renders ticks and labels correctly for each axis',
    async (axisName : string, tickMarkPos: Vector3, tickTextPos: Vector3) => {
      const element = GenerateTick(0, 0, 0, 1, 1, 0.002, 1, axisName, 1);

      const renderer = await ReactThreeTestRenderer.create(element);
      await waitFor(() => expect(renderer.scene.children).toBeDefined());

      const tickElement = renderer.scene.children[0];
      expect(tickElement.children.length).toEqual(2);

      const tickMark = tickElement.children[0];
      expect(tickMark.instance.position.equals(tickMarkPos)).toBeTruthy();

      const tickText = tickElement.children[1];
      expect(tickText.instance.position.equals(tickTextPos)).toBeTruthy();
      expect(tickText.props.text).toEqual('1');
    },
  );

  test.each([['x', new Vector3(1.5, 0, 0), new Vector3(1.5, -0.02, 0)],
    ['y', new Vector3(0, 1.5, 0), new Vector3(0.03, 1.5, 0)],
    ['z', new Vector3(0, 0, 1.5), new Vector3(0, -0.02, 1.5)]])(
    'expect.soft Scale ticks and labels correctly for each axis with scale factor 3',
    async (axisName : string, tickMarkPos: Vector3, tickTextPos: Vector3) => {
      const element = GenerateTick(0, 0, 0, 1, 3, 0.002, 1, axisName, 1);

      const renderer = await ReactThreeTestRenderer.create(element);
      await waitFor(() => expect(renderer.scene.children).toBeDefined());

      const tickElement = renderer.scene.children[0];
      expect(tickElement.children.length).toEqual(2);

      const tickMark = tickElement.children[0];
      expect(tickMark.instance.position.equals(tickMarkPos)).toBeTruthy();

      const tickText = tickElement.children[1];
      expect(tickText.instance.position.equals(tickTextPos)).toBeTruthy();
      expect(tickText.props.text).toEqual('1');
    },
  );

  test('Should throw exception when provided with invalid axis', async () => {
    expect(() => GenerateTick(0, 0, 0, 1, 3, 0.002, 1, 'INVALID AXIS', 1))
      .toThrowError('Invalid axis provided: INVALID AXIS');
  });
});
