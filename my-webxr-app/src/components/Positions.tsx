import {Vector3} from "three";


/**
 * Creates a Vector for the points position relative to the size of the Axis and the Data given to the point
 * @param {Array<number>} data - The actual data that determines the position of the point, must be in the format [x,y,z]
 * @param {Array<number>} AxisStartPoints - The starting point of each Axis, there must be three entries in the format [x,y,z]
 * @param {number} AxisEndpoints - This is the number in which that the axis travel to?
 * @return {Vector3} - this is the final position of the point.
 */
export function createPosition(data: Array<number>, AxisStartPoints:Array<number>, AxisEndpoints:number){
    if (data.length!=3 || AxisStartPoints.length!=3 || AxisEndpoints == undefined || AxisEndpoints <0 ){
        throw new Error("Error in Positions.tsx: Parameters do not meet requirements. data must be an array of 3 numbers," +
            "AxisStartPoints must have 3 entries, one for each axis, in the format [x,y,z], and AxisEndpoints must be " +
            "greater then or equal to 0 ")
    }

    console.log(data)
    console.log(AxisStartPoints)
    console.log(AxisEndpoints)
    return new Vector3(1,2,3);
}