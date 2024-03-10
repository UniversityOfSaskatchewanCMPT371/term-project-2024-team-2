// /** @jest-environment jsdom */
/* eslint-disable import/first */
// import fetch, { enableFetchMocks } from 'jest-fetch-mock';
//
// enableFetchMocks();
// import 'jest-canvas-mock';
// import 'jest-webgl-canvas-mock';
import { setupJestCanvasMock } from 'jest-webgl-canvas-mock';
import ReactThreeTestRenderer from '@react-three/test-renderer';
// eslint-disable-next-line import/no-extraneous-dependencies
// import { XR } from '@react-three/xr';
import { Vector3 } from 'three';
import { http, HttpResponse } from 'msw';
import { setupServer, SetupServerApi} from 'msw/node';
import {openAsBlob} from 'node:fs';
// import { createCanvas } from 'canvas';
import {XR} from '@react-three/xr';
import Axis from '../src/components/Axis';

async function readFile() {
  const blob = await openAsBlob('./src/assets/sans-serif.normal.100.woff');
  const ab = await blob.arrayBuffer();
  return ab;
}

beforeAll(() => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  global.IS_REACT_ACT_ENVIRONMENT = true;
});

describe('Axis Tests', () => {
  let worker: SetupServerApi;
  let data: ArrayBuffer | undefined;
  beforeAll(async () => {
    data = await readFile();
    // 2. Describe network behavior with request handlers.
    worker = setupServer(
      http.get(
        'https://cdn.jsdelivr.net/gh/lojjic/unicode-font-resolver@v1.0.1/packages/data/*',
        async () => {
          console.log(data);
          return HttpResponse.arrayBuffer(data, {
            headers: {
              'Content-Type': 'font/woff',
            },
          });
        },
      ),
    );

    worker.events.on('request:start', ({ request }) => {
      console.log('MSW intercepted:', request.method, request.url);
    });
  });

  beforeEach(() => {
    jest.resetAllMocks();
    setupJestCanvasMock();
    worker.listen();
  });

  afterEach(() => worker.resetHandlers());
  afterAll(() => worker.close());
  test('Create 3D axis with random values', async () => {
    function Element() {
      return (
        <XR>
          <Axis
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
    await renderer.update(<Element />);
    // await waitFor(() => expect(renderer.scene.children));
    // check the position vector is correct
    expect(renderer.scene.children[1].children[0].instance.position).toEqual(
      new Vector3(0, 0.82, -0.15),
    );
    const what = renderer.scene.children[1].children[191].children[1].instance;
    expect(what).toEqual('10');
    // console.log(what);
  }, 10000);

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
