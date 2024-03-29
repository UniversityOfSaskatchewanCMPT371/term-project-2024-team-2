import ReactThreeTestRenderer from '@react-three/test-renderer';
import { XR } from '@react-three/xr';
import { Vector3 } from 'three';
import { PointSelectionProvider } from '../src/contexts/PointSelectionContext';
import DataPoint from '../src/components/DataPoint';
import GenerateXYZ from '../src/components/GenerateXYZ';
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

describe("Datapoint's Location is based off of values given ", () => {
  test('Test #1: Creating Datapoint with the location/coordinates 1,2,3, making sure that the positions'
        + 'actually work', async () => {
    const render = await ReactThreeTestRenderer.create(
      <PointSelectionProvider>
        <XR>
          <DataPoint id={0} marker="circle" color="gray" columnX="John Doe" columnY="cmpt 145" columnZ={97} meshProps={{ position: [1, 2, 3] }} />
          <GenerateXYZ
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
      </PointSelectionProvider>,
    );
    expect(render.scene.children[1].children[0].instance.position).toEqual(
      new Vector3(1, 2, 3),
    );
  });

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
