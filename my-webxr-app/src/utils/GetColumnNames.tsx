import DbRepository from '../repository/DbRepository';
import assert from './Assert';

/*
  this function gets all available column titles from the database
  @params:
      - dbName: the name of the database to get the data from
  @pre-condition: dB name cannot be empty, relies on database
  @post-condition:
  @return: promise of array of strings that represent column titles
 */
export async function getColumnTitles(dbName: string): Promise<string[]> {
  assert(dbName != null, 'Database name cannot be null');
  try {
    // instead of new repository, will need to get the instance from the DAL
    const dbRepository = new DbRepository(dbName);
    const axesArray = await dbRepository.getPossibleAxes();
    if (!Array.isArray(axesArray)) {
      throw new Error('DbRepository.getPossibleAxes() did not return an array');
    }
    return axesArray;
  } catch (error) {
    throw new Error('Error getting array of possible axes');
  }
}

/*
  this function sets the columns for x,y,z axis in the database
  @params:
      - dbName: the name of the database to get the data from
      - xTitle: title of x-axis column
      - yTitle: title of y-axis column
      - zTitle: title of z-axis column
  @pre-condition: dB name cannot be empty, relies on database
  @post-condition:
  @return: promise of array of strings that contains the selected x,y,z axis columns
 */
export async function setRepresentingColumns(
  dbName: string,
  xTitle: string,
  yTitle: string,
  zTitle: string,
) {
  assert(
    dbName != null && xTitle != null && yTitle != null && zTitle != null,
    'Parameters cannot be null to setRepresentingColumns',
  );
  try {
    // instead of new repository, will need to get the instance from the DAL
    const dbRepository = new DbRepository(dbName);
    const xyzColumns = await dbRepository.selectRepresentingColumn(xTitle, yTitle, zTitle);
    if (!Array.isArray(xyzColumns)) {
      throw new Error('DbRepository.selectRepresentingColumn() did not return an array');
    }
    return xyzColumns;
  } catch (error) {
    throw new Error(`Error getting array with x, y, z axes: ${error}`);
  }
}
