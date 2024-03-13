import DbRepository from '../repository/DbRepository';
import assert from './Assert';

export async function getColumnTitles(dbName: string): Promise<string[]> {
  assert(dbName != null, 'Database name cannot be null');
  try {
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
