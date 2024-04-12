import ReactThreeTestRenderer from '@react-three/test-renderer';
import { XR } from '@react-three/xr';
import { ReactThreeTestInstance } from
  '@react-three/test-renderer/dist/declarations/src/createTestInstance';
import { expect } from 'vitest';
import Dexie from 'dexie';
import { Provider } from '@rollbar/react';
import { Vector3 } from 'three';
import MockServer from '../MockServer';
import GenerateXYZ from '../../src/components/GenerateXYZ';
import DataAbstractor, { getDatabase } from '../../src/data/DataAbstractor';
import { useAxesSelectionContext } from '../../src/contexts/AxesSelectionContext';
import { PointSelectionProvider } from '../../src/contexts/PointSelectionContext';
import { rollbarConfig } from '../../src/utils/LoggingUtils';

vi.mock('../../src/contexts/AxesSelectionContext');

describe('Generate XYZ axes', () => {
  let database: DataAbstractor;

  beforeEach(async () => {
    MockServer.listen();

    await Dexie.delete('CsvDataBase');
    database = getDatabase();

    vi.mocked(useAxesSelectionContext).mockReturnValue({
      selectedXAxis: 'colX',
      setSelectedXAxis: vi.fn(),
      selectedYAxis: 'colY',
      setSelectedYAxis: vi.fn(),
      selectedZAxis: 'colZ',
      setSelectedZAxis: vi.fn(),
      selectedOptionalColumn1: '',
      setSelectedOptionalColumn1: vi.fn(),
      selectedOptionalColumn2: '',
      setSelectedOptionalColumn2: vi.fn(),
      selectedOptionalColumn3: '',
      setSelectedOptionalColumn3: vi.fn(),
      selectedOptionalColumn4: '',
      setSelectedOptionalColumn4: vi.fn(),
      selectedOptionalColumn5: '',
      setSelectedOptionalColumn5: vi.fn(),
      selectedOptionalColumn6: '',
      setSelectedOptionalColumn6: vi.fn(),
      selectedOptionalColumn7: '',
      setSelectedOptionalColumn7: vi.fn(),
    });
  });

  afterEach(() => MockServer.resetHandlers());

  afterAll(() => MockServer.close());

  test('Create 3D axis, and check for ticks label of each axis of diff max values magnitude:'
    + '1, 10 & 100', async () => {
    const batchItems = [
      ['colX', 'colY', 'colZ'],
      [1, 10, 100], // max values
    ];
    await database.storeCSV(batchItems);

    const render = await ReactThreeTestRenderer.create(
      <Provider config={rollbarConfig}>
        <PointSelectionProvider>
          <XR>
            <GenerateXYZ
              scaleFactor={1}
              labelOffset={1}
              startX={0}
              startY={0}
              startZ={0}
              radius={0.002}
              database={database}
            />
          </XR>
        </PointSelectionProvider>
      </Provider>,
    );

    // wait for scene children to be rendered
    await vi.waitFor(() => expect(render.scene.children).toBeDefined());

    // wait for the axes to be rendered, should have three axes
    const axes = render.scene.children[1].children;
    expect(axes.length).toEqual(3);

    // wait until the useEffect to finish update then render the return element, 21 ticks & 1 axis
    await vi.waitUntil(() => (axes[0].children.length === 22));

    // For each axis, check the number of children
    axes.forEach((axis: ReactThreeTestInstance) => {
      // 21 ticks and 1 axis line
      expect(axis.children).toHaveLength(22);
      // check it has 1 axis line
      expect(axis.children[0].instance.name).toEqual('Axis Line');
      // check it has 21 ticks
      const ticks = axis.children.filter((e) => e.instance.name === 'tick');
      expect(ticks).toHaveLength(21);
      // check the position vector is correct
      expect(axis.children[0].instance.position.equals(new Vector3(0, 0, 0)))
        .toBeTruthy();
    });

    // check the tick total number and labels are showing correct text for each axis
    const xAxisTicks = axes[0].children.filter((e) => e.instance.name === 'tick');
    expect(xAxisTicks).toHaveLength(21);
    expect(xAxisTicks.map((e) => e.children[1].props.text))
      .toEqual([-1, -0.9, -0.8, -0.7, -0.6, -0.5, -0.4, -0.3, -0.2, -0.1,
        0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1].map(String));

    const yAxisTicks = axes[1].children.filter((e) => e.instance.name === 'tick');
    expect(yAxisTicks).toHaveLength(21);
    expect(yAxisTicks.map((e) => e.children[1].props.text))
      .toEqual([-10, -9, -8, -7, -6, -5, -4, -3, -2, -1,
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(String));

    const zAxisTicks = axes[2].children.filter((e) => e.instance.name === 'tick');
    expect(zAxisTicks).toHaveLength(21);
    expect(zAxisTicks.map((e) => e.children[1].props.text))
      .toEqual([-100, -90, -80, -70, -60, -50, -40, -30, -20, -10,
        0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map(String));
  });
});
