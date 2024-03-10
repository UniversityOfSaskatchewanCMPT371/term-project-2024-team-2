import { setupJestCanvasMock } from 'jest-webgl-canvas-mock';
import ReactThreeTestRenderer from '@react-three/test-renderer';
import { XR } from '@react-three/xr';
import { Vector3 } from 'three';
import { setupServer, SetupServerApi } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { openAsBlob } from 'node:fs';
import { PointSelectionProvider } from '../src/contexts/PointSelectionContext';
import DataPoint from '../src/components/DataPoint';
import Axis from '../src/components/Axis';
import createPosition from '../src/components/Positions';

const minNum: number = -10;
const maxNum: number = 10;
const scaleFactor: number = 1;
const labelOffset: number = 0.1;
const startPointX: number = -0.2;
const startPointY: number = 1.6;
const startPointZ: number = -0.5;
const endPoint: number = 1;
const radius: number = 0.002;

const exampleData = [[1, 1, 1], [2, 3, 0], [0, 0, 0], [10, 10, 10], [-1, -1, -1]];

const datapoint1 = createPosition({
  data: exampleData[0],
  AxisStartPoints: [startPointX, startPointY, startPointZ],
  length: endPoint,
  scale: scaleFactor,
  max: maxNum,
});
const datapoint2 = createPosition({
  data: exampleData[1],
  AxisStartPoints: [startPointX, startPointY, startPointZ],
  length: endPoint,
  scale: scaleFactor,
  max: maxNum,
});
const datapoint3 = createPosition({
  data: exampleData[2],
  AxisStartPoints: [startPointX, startPointY, startPointZ],
  length: endPoint,
  scale: scaleFactor,
  max: maxNum,
});
const datapoint4 = createPosition({
  data: exampleData[3],
  AxisStartPoints: [startPointX, startPointY, startPointZ],
  length: endPoint,
  scale: scaleFactor,
  max: maxNum,
});
const datapoint5 = createPosition({
  data: exampleData[4],
  AxisStartPoints: [startPointX, startPointY, startPointZ],
  length: endPoint,
  scale: scaleFactor,
  max: maxNum,
});

async function readFile() {
  const blob = await openAsBlob('./src/assets/sans-serif.normal.100.woff');
  return blob.arrayBuffer();
}

describe("Datapoint's Location is based off of values given ", () => {
  let worker: SetupServerApi;
  let data: ArrayBuffer | undefined;
  beforeAll(async () => {
    data = await readFile();
    // 2. Describe network behavior with request handlers.
    worker = setupServer(
      http.get(
        'https://cdn.jsdelivr.net/gh/lojjic/unicode-font-resolver@v1.0.1/packages/data/*',
        async () => HttpResponse.arrayBuffer(data, {
          headers: {
            'Content-Type': 'font/woff',
          },
        }),
      ),
    );
  });
  // to check if it's actually intercepting the requests
  //   worker.events.on('request:start', ({ request }) => {
  //     console.log('MSW intercepted:', request.method, request.url);
  //   });
  beforeEach(() => {
    jest.resetAllMocks();
    setupJestCanvasMock();
    worker.listen();
  });

  afterEach(() => worker.resetHandlers());
  afterAll(() => worker.close());

  test('Test #1: Creating Datapoint with the location/coordinates 1,2,3, making sure that the positions'
        + 'actually work', async () => {
    function Element() {
      return (
        <PointSelectionProvider>
          <XR>
            <DataPoint id={0} marker="circle" color="gray" columnX="John Doe" columnY="cmpt 145" columnZ={97} meshProps={{ position: [1, 2, 3] }} />
            <Axis
              minValue={minNum}
              maxValue={maxNum}
              scaleFactor={scaleFactor}
              startX={startPointX}
              startY={startPointY}
              startZ={startPointZ}
              endPoint={endPoint}
              radius={radius}
              labelOffset={labelOffset}
            />
          </XR>
        </PointSelectionProvider>
      );
    }
    const render = await ReactThreeTestRenderer.create(<Element />);
    await render.update(<Element />);
    expect(render.scene.children[1].children[0].instance.position).toEqual(
      new Vector3(1, 2, 3),
    );
  }, 10000);

  test(' Test #2: Giving DataPoints a repeating data set to see how it is represented', async () => {
    const render = await ReactThreeTestRenderer.create(
      <PointSelectionProvider>
        <XR>
          <DataPoint id={4} marker="circle" color="gray" columnX="John Doe" columnY="cmpt 145" columnZ={97} meshProps={{ position: datapoint1 }} />
        </XR>
      </PointSelectionProvider>,

    );
    expect(render.scene.children[1].children[0].instance.position).toEqual(
      new Vector3(-0.15000000000000002, 1.6500000000000001, -0.45),
    );
  });

  test('Test #3: Give DataPoints a dataset that contains a 0 in it to see '
        + 'how it is handled', async () => {
    const render = await ReactThreeTestRenderer.create(
      <PointSelectionProvider>
        <XR>
          <DataPoint id={4} marker="circle" color="gray" columnX="John Doe" columnY="cmpt 145" columnZ={97} meshProps={{ position: datapoint2 }} />
        </XR>
      </PointSelectionProvider>,

    );
    expect(render.scene.children[1].children[0].instance.position).toEqual(
      new Vector3(-0.1, 1.75, -0.5),
    );
  });
  test("Test #4: testing with all 0's to make sure it behaves as intended", async () => {
    const render = await ReactThreeTestRenderer.create(
      <PointSelectionProvider>
        <XR>
          <DataPoint id={4} marker="circle" color="gray" columnX="John Doe" columnY="cmpt 145" columnZ={97} meshProps={{ position: datapoint3 }} />
        </XR>
      </PointSelectionProvider>,

    );
    expect(render.scene.children[1].children[0].instance.position).toEqual(
      new Vector3(-0.2, 1.6, -0.5),
    );
  });
  test('Test #5: Testing with the maximum values make sure it is handled ', async () => {
    const render = await ReactThreeTestRenderer.create(
      <PointSelectionProvider>
        <XR>
          <DataPoint id={4} marker="circle" color="gray" columnX="John Doe" columnY="cmpt 145" columnZ={97} meshProps={{ position: datapoint4 }} />
        </XR>
      </PointSelectionProvider>,

    );
    expect(render.scene.children[1].children[0].instance.position).toEqual(
      new Vector3(0.3, 2.1, 0),
    );
  });
  test('Test #6: Testing with all negative values to make sure that '
        + 'it behaves as it should', async () => {
    const render = await ReactThreeTestRenderer.create(
      <PointSelectionProvider>
        <XR>
          <DataPoint id={4} marker="circle" color="gray" columnX="John Doe" columnY="cmpt 145" columnZ={97} meshProps={{ position: datapoint5 }} />
        </XR>
      </PointSelectionProvider>,

    );
    expect(render.scene.children[1].children[0].instance.position).toEqual(
      new Vector3(-0.25, 1.55, -0.55),
    );
  });
});
