import ReactThreeTestRenderer from '@react-three/test-renderer';
import { XR } from '@react-three/xr';
import { Vector3 } from 'three';
import { PointSelectionProvider } from '../src/contexts/PointSelectionContext';
import DataPoint from '../src/components/DataPoint';

describe('DataPoint Creation and Interaction', () => {
  test('creating a basic DataPoint with defaults', async () => {
    const renderer = await ReactThreeTestRenderer.create(
      <PointSelectionProvider>
        <XR>
          <DataPoint id={0} marker="circle" color="gray" columnX="John Doe" columnY="cmpt 145" columnZ={97} />
        </XR>
      </PointSelectionProvider>,
    );

    // Expect the DataPoint component to be created, along with its two meshes with default values.
    expect(renderer.scene.children.length).toEqual(2); // + native camera component = 2
    expect(renderer.scene.children[1].children.length).toEqual(2);
  });

  test('creating a basic DataPoint and assign position', async () => {
    const renderer = await ReactThreeTestRenderer.create(
      <PointSelectionProvider>
        <XR>
          <DataPoint id={0} marker="circle" color="gray" columnX="John Doe" columnY="cmpt 145" columnZ={97} meshProps={{ position: [1, 2, 3] }} />
        </XR>
      </PointSelectionProvider>,
    );

    // Check if the both mesh positions are accurate.
    expect(renderer.scene.children[1].children[0].instance.position).toEqual(
      new Vector3(1, 2, 3),
    );
  });

  test('creating a basic DataPoint and assign outline scale', async () => {
    const renderer = await ReactThreeTestRenderer.create(
      <PointSelectionProvider>
        <XR>
          <DataPoint id={0} marker="circle" color="gray" columnX="John Doe" columnY="cmpt 145" columnZ={97} outlineScale={2} />
        </XR>
      </PointSelectionProvider>,
    );

    // Check if the outline mesh scale is accurate.
    expect(renderer.scene.children[1].children[1].instance.scale).toEqual(
      new Vector3(2, 2, 2),
    );
  });
});

describe('DataPoint UI Interaction', () => {
  test('create a basic DataPoint and check all its fields', async () => {
    const renderer = await ReactThreeTestRenderer.create(
      <PointSelectionProvider>
        <XR>
          <DataPoint id={0} marker="circle" color="gray" columnX="John Doe" columnY="cmpt 145" columnZ={97} />
        </XR>
      </PointSelectionProvider>,
    );

    // renderer.scene.children[1] gets the scene
    // renderer.scene.children[1].children[0] gets ReactThreeTest instance
    // renderer.scene.children[1].children[0].instance gets reference to a mesh component

    // Check if the point id value is accurate.
    expect(renderer.scene.children[1].children[0].instance.userData.id).toBe(0);
    // Check if the point marker value is accurate.
    expect(renderer.scene.children[1].children[0].instance.userData.marker).toBe('circle');
    // Check if the point color value is accurate.
    expect(renderer.scene.children[1].children[0].instance.userData.color).toBe('gray');
    // Check if the point column1 value is accurate.
    expect(renderer.scene.children[1].children[0].instance.userData.columnX).toBe('John Doe');
    // Check if the point column2 value is accurate.
    expect(renderer.scene.children[1].children[0].instance.userData.columnY).toBe('cmpt 145');
    // Check if the point column3 value is accurate.
    expect(renderer.scene.children[1].children[0].instance.userData.columnZ).toBe(97);
  });
});
