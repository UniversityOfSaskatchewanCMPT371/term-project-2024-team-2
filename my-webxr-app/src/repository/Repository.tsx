import DataPoint from './DataPoint';
import Column from './Column';

export interface Repository {

  /**
   * Asynchronously retrieves the data points associated with the provided column names
   * @param {boolean} qualifyingPointOnly Whether or not to filter out data rows with
   *      undefined or missing values
   * @param {string} columnXName The name of the column to be plotted on the x-axis
   * @param {string} columnYName The name of the column to be plotted on the y-axis
   * @param {string} columnZName The name of the column to be plotted on the z-axis
   * @return {Promise<Array<DataPoint>>} An array of data point objects
   * @pre-condition 3 column names must be distinct and existing in the db
   * @post-condition A set of data points that can be plotted
   */
  getPoints: (qualifyingPointOnly : boolean,
    columnXName: string,
    columnYName: string,
    columnZName: string) => Promise<Array<DataPoint>>;

  /**
   * Asynchronously adds a column to the database
   * @param {Column} column A column data object
   * @return {Promise<string>} The name of the column
   * @pre-condition The column is not already in the database
   * @post-condition The column will be added to the database and can be referenced by the
   *      returned name
   */
  addColumn: (column : Column) => Promise<string>;
}
