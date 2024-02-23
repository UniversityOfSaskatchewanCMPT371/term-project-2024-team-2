import ReactThreeTestRenderer from "@react-three/test-renderer";
import { XR } from "@react-three/xr";
import { PointSelectionProvider } from "../src/contexts/PointSelectionContext";
import DataPoint from "../src/components/DataPoint";
import { Vector3 } from "three";

describe("Datapoint's Location is based off of values given ",()=>{
    test("Creating Datapoint with the location/coordinates 1,1,1", async () =>{
        const render= await ReactThreeTestRenderer.create(
            <PointSelectionProvider>
                <XR>
                    <DataPoint id={1} meshProps={{position:[1,1,1]}}>
                    </DataPoint>
                </XR>
            </PointSelectionProvider>
        );
        console.log(render.scene.children[1].children)
        expect(render.scene.children[1].children[0].instance.position).toEqual(
            new Vector3(1,1,1)
        )
    } )

    test("Giving a Datapoint a 'fake' value that will account for the PCA", async () =>{
        const render = await ReactThreeTestRenderer.create(
            <PointSelectionProvider>
                <XR>
                    <DataPoint id={4} dataSet={[1,2,3]}>
                    </DataPoint>
                </XR>
            </PointSelectionProvider>

        )
        expect(render.scene.children[1].children[0].instance.position).toEqual(
            new Vector3(1,2,3)
        )
    })
})

