import ReactThreeTestRenderer, { waitFor } from '@react-three/test-renderer';
import { XR } from '@react-three/xr';
import { Vector3 } from 'three';
import { expect } from 'vitest';
import { PointSelectionProvider } from '../../src/contexts/PointSelectionContext';
import MockServer from '../MockServer';
import DataPoint from '../../src/repository/DataPoint';
import { createGraphingDataPoints } from '../../src/components/CreateGraphingDataPoints';

const exampleData = [[1, 1, 1], [2, 3, 0], [0, 0, 0], [10, 10, 10], [-1, -1, -1]];
const dataPoints = exampleData.map((point) => new DataPoint(point[0], point[1], point[2]));
const columnX = 'X';
const columnY = 'Y';
const columnZ = 'Z';
const AxisStartPoints = [-0.2, 1.6, -0.5];
const length = 1;
const scale = 1;
const max = 10;

const positions = [
  new Vector3(-0.15000000000000002, 1.6500000000000001, -0.45),
  new Vector3(-0.1, 1.75, -0.5),
  new Vector3(-0.2, 1.6, -0.5),
  new Vector3(0.3, 2.1, 0),
  new Vector3(-0.25, 1.55, -0.55),
];

describe('createGraphingDataPoints', () => {
  beforeEach(() => MockServer.listen());

  afterEach(() => MockServer.resetHandlers());

  afterAll(() => MockServer.close());

  test('Check locations of points against hard coded values', async () => {
    const dataGraphingPoints = createGraphingDataPoints(
      dataPoints,
      columnX,
      columnY,
      columnZ,
      AxisStartPoints,
      length,
      scale,
      max,
    );
    const render = await ReactThreeTestRenderer.create(
      <PointSelectionProvider>
        <XR>
          {dataGraphingPoints}
        </XR>
      </PointSelectionProvider>,
    );
    await waitFor(() => expect(render.scene.children).toBeDefined());
    // The camera is also a child of the scene, with 5 points we have 6 children
    expect(render.scene.children.length).toEqual(6);

    // Children 0 is the camera
    // Children 1-5 are the points, check position and name
    expect(render.scene.children[1].children[1].instance.position.equals(positions[0])).toBe(true);
    expect(render.scene.children[1].children[1].instance.name).toEqual('point sphere');

    expect(render.scene.children[2].children[1].instance.position.equals(positions[1])).toBe(true);
    expect(render.scene.children[2].children[1].instance.name).toEqual('point sphere');

    expect(render.scene.children[3].children[1].instance.position.equals(positions[2])).toBe(true);
    expect(render.scene.children[3].children[1].instance.name).toEqual('point sphere');

    expect(render.scene.children[4].children[1].instance.position.equals(positions[3])).toBe(true);
    expect(render.scene.children[4].children[1].instance.name).toEqual('point sphere');

    expect(render.scene.children[5].children[1].instance.position.equals(positions[4])).toBe(true);
    expect(render.scene.children[5].children[1].instance.name).toEqual('point sphere');
  });
});
