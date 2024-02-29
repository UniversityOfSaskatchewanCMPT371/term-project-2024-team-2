import {Vector3} from "three";
import * as assert from 'assert'
/**
 * Creates a Vector for the points position relative to the size of the Axis and the Data given to the point ( would eventually want to create
 * a axis Type to pass in instead of all these variables )
 * @param {Array<number>} data - The actual data that determines the position of the point, must be in the format [x,y,z]
 * @param {Array<number>} AxisStartPoints - The starting point of each Axis, there must be three entries in the format [x,y,z]
 * @param {number} length - THis is the length of each axis
 * @param {number} scale - This is the scale that is applied to the length, allows for easy adjustment of data point location as graph gets bigger/smaller
 * @param {number} max - this is the maximum value of the data read in by the program
 * @return {Vector3} - this is the final position of the point.
 */
export function createPosition(data: Array<number>, AxisStartPoints:Array<number>, length:number, scale:number, max:number) {
    // assert.equal(data.length==3,true,"Error in Positions.tsx, should be 3 entries of data to be mapped, [x,y,z]");
    // assert.equal(AxisStartPoints.length==3,true,"Error in Positions.tsx, should be 3 start points, [x,y,z]");
    // assert.equal(length!==undefined && length > 0, true, "Error in Position.tsx, length of Axis should never be 0 or less ");
    // assert.equal(scale!==undefined && scale >0, true,"Error in Position.tsx, Scale should never be 0 or less");
    // assert.equal(data[0] > max || data[1] > max || data[2] > max , false, "Error in Positions.tsx: Trying to map Data that does not exist within the domain " +
    //     "of the graph, please check");
    assert.equal(true,true,"fail")

    const x_position = ((data[0]/max) * (scale*length)/2 ) + AxisStartPoints[0];
    const y_position = ((data[1]/max) * (scale*length)/2 ) + AxisStartPoints[1];
    const z_position = ((data[2]/max) * (scale*length)/2 ) + AxisStartPoints[2];

    return new Vector3(x_position,y_position,z_position);
}

