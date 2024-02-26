import ReactThreeTestRenderer from "@react-three/test-renderer";
import { XR } from "@react-three/xr";
import { PointSelectionProvider } from "../src/contexts/PointSelectionContext";
import DataPoint from "../src/components/DataPoint";
import { Vector3 } from "three";
import Axis from "../src/components/axis";
import {createPosition} from "../src/components/Positions";
// const dataset= new Vector3(1,2,3);


// minNum and maxNum will be from the csv file, just hardcoded for now
const minNum: number = -10;
const maxNum: number = 10;
// scaleFactor adjusts the size of the 3D axis
const scaleFactor: number = 1;
// labelOffset is the offset the axis ticks and labels will have
const labelOffset: number = 0.1;
//starting point of the axis
const startPointX: number = 0;
const startPointY: number = 0.82;
const startPointZ: number = -0.15;
// endPoint is used to determine what axis is being calculated, should not need to change
const endPoint: number = 1;
// adjust the size of the tube, shouldn't need to change unless
const radius: number = 0.002;
const pos: Vector3 = createPosition([1,2,3], [startPointX,startPointY,startPointZ], endPoint)

describe("Datapoint's Location is based off of values given ",()=>{
    test("Creating Datapoint with the location/coordinates 1,1,1", async () =>{
        const render= await ReactThreeTestRenderer.create(
            <PointSelectionProvider>
                <XR>
                    <DataPoint id={1} meshProps={{position:[1,2,3]} }/>
                    <Axis minValue={minNum} maxValue={maxNum} scaleFactor={scaleFactor} startX={startPointX}
                          startY={startPointY} startZ={startPointZ} endPoint={endPoint} radius={radius}
                          labelOffset={labelOffset}/>
                </XR>
            </PointSelectionProvider>
        );
        expect(render.scene.children[1].children[0].instance.position).toEqual(
            new Vector3(1,2,3)
        )

    } )

    test("Giving a Datapoint a 'fake' value that will account for the PCA", async () =>{
        console.log(pos)
        const render = await ReactThreeTestRenderer.create(
            <PointSelectionProvider>
                <XR>
                    <DataPoint id={4} meshProps={{position:pos}} >
                    </DataPoint>
                </XR>
            </PointSelectionProvider>

        )
        expect(render.scene.children[1].children[0].instance.position).toEqual(
            new Vector3(1,2,3)
        )
    })
})

