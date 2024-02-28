import {Vector3} from "three";


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
    if (data.length !== 3 || AxisStartPoints.length !== 3 || length === undefined || length < 0) {
        throw new Error("Error in Positions.tsx: Parameters do not meet requirements. data must be an array of 3 numbers," +
            "AxisStartPoints must have 3 entries, one for each axis, in the format [x,y,z], and AxisEndpoints must be " +
            "greater than or equal to 0 ");
    }
    if(data[0] > max || data[1] > max || data[2] > max){
        throw new Error("Error in Positions.tsx: Trying to map Data that does not exist within the domain " +
            "of the graph, please check ")
    }
    const x_position = ((data[0]/max) * (scale*length)/2 ) + AxisStartPoints[0]
    const y_position = ((data[1]/max) * (scale*length)/2 ) + AxisStartPoints[1]
    const z_position = ((data[2]/max) * (scale*length)/2 ) + AxisStartPoints[2]

    return new Vector3(x_position,y_position,z_position);
}

