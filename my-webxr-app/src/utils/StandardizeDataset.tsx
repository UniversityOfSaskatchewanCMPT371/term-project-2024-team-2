import { Matrix } from 'ml-matrix';
import assert from './Assert';

/**
 * Standardizes the given dataset.
 *
 * This is done by subtracting the mean and dividing by the standard deviation for each feature
 * independently.
 * If the standard deviation of a feature is zero, that feature is left unchanged.
 *
 * @pre-condition
 *    - dataSetMatrix has at least two rows and two columns
 *    - dataSetMatrix is numeric
 * @post-condition returns the standardized transformation fo hte matrix
 * @param {Matrix} dataSetMatrix - The dataset to standardize, represented as a Matrix.
 * @returns {Matrix}The standardized matrix of dataset.
 */
export default function standardizeDataset(dataSetMatrix: Matrix): Matrix {
  assert(dataSetMatrix.rows >= 2 && dataSetMatrix.columns >= 2, `Invalid data set: ${dataSetMatrix.rows} rows, ${dataSetMatrix.columns} columns.`);
  const mean = dataSetMatrix.mean('column');
  const stdevs = dataSetMatrix.standardDeviation('column', { mean });

  for (let i = 0; i < dataSetMatrix.columns; i += 1) {
    if (stdevs[i] === 0) {
      // This column has a standard deviation of zero, so it is constant, and we cannot standardize.
      // eslint-disable-next-line no-continue
      continue;
    }
    for (let j = 0; j < dataSetMatrix.rows; j += 1) {
      const standardizedValue = (dataSetMatrix.get(j, i) - mean[i]) / stdevs[i];
      dataSetMatrix.set(j, i, standardizedValue);
    }
  }
  return dataSetMatrix;
}
