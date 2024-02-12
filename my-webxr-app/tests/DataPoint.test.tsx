import ReactThreeTestRenderer from "@react-three/test-renderer";
import { XR } from "@react-three/xr";
import { PointSelectionProvider } from "../src/contexts/PointSelectionContext";
import DataPoint from "../src/components/DataPoint";
import { Vector3 } from "three";

describe("DataPoint Creation and Interaction", () => {
  test("creating a basic DataPoint with defaults", async () => {
    const renderer = await ReactThreeTestRenderer.create(
      <PointSelectionProvider>
        <XR>
          <DataPoint id={0} />
        </XR>
      </PointSelectionProvider>,
    );

    console.log(renderer.scene.children[1].children);
    // Expect the DataPoint component to be created, along with its two meshes with default values.
    expect(renderer.scene.children.length).toEqual(2); // + native camera component = 2
    expect(renderer.scene.children[1].children.length).toEqual(2);
  });

  test("creating a basic DataPoint and assign position", async () => {
    const renderer = await ReactThreeTestRenderer.create(
      <PointSelectionProvider>
        <XR>
          <DataPoint id={0} meshProps={{ position: [1, 2, 3] }} />
        </XR>
      </PointSelectionProvider>,
    );

    // Same tests and check if the both mesh positions are accurate.
    expect(renderer.scene.children.length).toEqual(2); // + native camera component = 2
    expect(renderer.scene.children[1].children.length).toEqual(2);
    expect(renderer.scene.children[1].children[0].instance.position).toEqual(
      new Vector3(1, 2, 3),
    );
  });

  test("creating a basic DataPoint and assign outline scale", async () => {
    const renderer = await ReactThreeTestRenderer.create(
      <PointSelectionProvider>
        <XR>
          <DataPoint id={0} outlineScale={2} />
        </XR>
      </PointSelectionProvider>,
    );

    // Same tests and check if the outline mesh scale is accurate.
    expect(renderer.scene.children.length).toEqual(2); // + native camera component = 2
    expect(renderer.scene.children[1].children.length).toEqual(2);
    expect(renderer.scene.children[1].children[1].instance.scale).toEqual(
      new Vector3(2, 2, 2),
    );
  });
});
