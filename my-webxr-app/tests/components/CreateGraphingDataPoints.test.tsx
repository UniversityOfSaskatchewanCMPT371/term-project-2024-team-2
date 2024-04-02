import ReactThreeTestRenderer from '@react-three/test-renderer';
import { XR } from '@react-three/xr';
import { Vector3 } from 'three';
import { expect } from 'vitest';
import { Provider } from '@rollbar/react';
import Dexie from 'dexie';
import MockServer from '../MockServer';
import CreateGraphingDataPoints from '../../src/components/CreateGraphingDataPoints';
import { rollbarConfig } from '../../src/utils/LoggingUtils';
import DataAbstractor, { getDatabase } from '../../src/data/DataAbstractor';
import { useAxesSelectionContext } from '../../src/contexts/AxesSelectionContext';
import { usePointSelectionContext } from '../../src/contexts/PointSelectionContext.tsx';

// TODO: These values are based on the hard-coded values in CreateGraphingDataPoints and will
//  have to be updated when the hardcoded values are removed.
const positions = [
  new Vector3(0.1, 1.6, -1.4),
  new Vector3(0.2, 1.8, -1.5),
  new Vector3(0, 1.5, -1.5),
  new Vector3(1, 2.5, -0.5),
  new Vector3(-0.1, 1.4, -1.6),
];

vi.mock('../../src/contexts/PointSelectionContext');
vi.mock('../../src/contexts/AxesSelectionContext');

describe('createGraphingDataPoints', () => {
  let database: DataAbstractor;

  beforeEach(async () => {
    MockServer.listen();

    await Dexie.delete('CsvDataBase');
    database = getDatabase();
  });

  afterEach(() => MockServer.resetHandlers());

  afterAll(() => MockServer.close());

  test('Check locations of points against hard coded values and scale value of 2', async () => {
    const batchItems = [
      ['colX', 'colY', 'colZ'],
      [1, 1, 1],
      [2, 3, 0],
      [0, 0, 0],
      [10, 10, 10],
      [-1, -1, -1],
    ];
    await database.storeCSV(batchItems);

    vi.mocked(usePointSelectionContext).mockReturnValue({
      selectedDataPoint: {
        id: -1,
        columnX: '',
        columnY: '',
        columnZ: '',
        marker: '',
        color: '',
      },
      setSelectedDataPoint: vi.fn(),
    });

    vi.mocked(useAxesSelectionContext).mockReturnValue({
      selectedXAxis: 'colX',
      setSelectedXAxis: vi.fn(),
      selectedYAxis: 'colY',
      setSelectedYAxis: vi.fn(),
      selectedZAxis: 'colZ',
      setSelectedZAxis: vi.fn(),
    });

    const render = await ReactThreeTestRenderer.create(
      <Provider config={rollbarConfig}>
        <XR>
          <CreateGraphingDataPoints
            scaleFactor={2}
            startX={0}
            startY={1.5}
            startZ={-1.5}
            database={database}
          />
        </XR>
      </Provider>,
    );

    await vi.waitFor(() => expect(render.scene.children).toBeDefined());
    // The camera is also a child of the scene, with 5 points we have 6 children
    await vi.waitUntil(() => (render.scene.children.length === 6));
    // render.scene.children.forEach((val) => console.log(val.children));

    // Children 0 is the camera
    // Children 1-5 are the points, check position and name
    expect(render.scene.children[1].children[0].instance.position.equals(positions[0])).toBe(true);
    expect(render.scene.children[1].children[0].instance.type).toEqual('Mesh');

    expect(render.scene.children[2].children[0].instance.position.equals(positions[1])).toBe(true);
    expect(render.scene.children[2].children[0].instance.type).toEqual('Mesh');

    expect(render.scene.children[3].children[0].instance.position.equals(positions[2])).toBe(true);
    expect(render.scene.children[3].children[0].instance.type).toEqual('Mesh');

    expect(render.scene.children[4].children[0].instance.position.equals(positions[3])).toBe(true);
    expect(render.scene.children[4].children[0].instance.type).toEqual('Mesh');

    expect(render.scene.children[5].children[0].instance.position.equals(positions[4])).toBe(true);
    expect(render.scene.children[5].children[0].instance.type).toEqual('Mesh');
  });
});
