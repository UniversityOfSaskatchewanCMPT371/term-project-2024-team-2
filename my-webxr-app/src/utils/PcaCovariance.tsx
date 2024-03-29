import { EVD, Matrix } from 'ml-matrix';
import assert from './Assert';
import standardizeDataset from './StandardizeDataset';

/**
 * Inspired by: https://medium.com/analytics-vidhya/understanding-principle-component-analysis-pca-step-by-step-e7a4bb4031d9
 *
 * Steps involved in this method of PCA
 *    1: Standardize the dataset.
 *    2: Calculate the covariance matrix for the features in the dataset.
 *    3: Calculate the eigenvalues and eigenvectors for the covariance matrix and sort eigenvalues
 *    and their corresponding eigenvectors.
 *    4: Then take product of dataset and eigenvectors to form PCA matrix.
 * /

/**
 * Calculates the covariance matrix of the given dataset.
 *
 * Formula: (X^T * X) * (1/(n-1))
 *
 * @param {Matrix} dataSetMatrix - The dataset to calculate the covariance matrix for, represented
 * as a Matrix.
 * @returns {Matrix} The covariance matrix of the dataset. This matrix is symmetric.
 * @throws {Error} If the number of rows in the dataset is one or zero.
 */
export function calculateCovarianceMatrix(dataSetMatrix: Matrix): Matrix {
  assert(dataSetMatrix.rows !== 0, 'Data set of zero row!');
  assert(dataSetMatrix.rows !== 1, 'Number of rows in the dataset is one, causing division by zero in covariance matrix calculation.');
  return dataSetMatrix.transpose().mmul(dataSetMatrix).div(dataSetMatrix.rows - 1);
}

/**
 * Computes the eigenvalues from a covariance matrix.
 *
 * It uses Eigenvalue Decomposition (EVD) to compute the eigenvalues. The eigenvalues are then
 * sorted in descending order, so that the first eigenvalue corresponds to the direction of maximum
 * variance in the data, the second to the direction of second most variance, and so on.
 *
 * @param {Matrix} covarianceMatrix - The covariance matrix from which to compute the eigenvalues.
 * @returns {number[]} An array of eigenvalues in descending order.
 * @throws {Error} If the input matrix is not symmetric.
 */
export function computeEigenvaluesFromCovarianceMatrix(covarianceMatrix: Matrix): number[] {
  assert(covarianceMatrix.isSymmetric(), 'Compute eigenvalues from non symmetric covariance matrix.');
  const evd = new EVD(covarianceMatrix, { assumeSymmetric: true });
  const S = evd.realEigenvalues;
  S.reverse();
  return S;
}

/**
 * Computes the eigenvectors from a covariance matrix.
 *
 * It uses Eigenvalue Decomposition (EVD) to compute the eigenvectors. The eigenvectors are then
 * sorted in descending order of their corresponding eigenvalues, so that the first eigenvector
 * corresponds to the direction of maximum variance in the data, the second to the direction of
 * second most variance, and so on.
 *
 * @param {Matrix} covarianceMatrix - The covariance matrix from which to compute the eigenvectors.
 * @returns {Matrix} A matrix of eigenvectors (U).
 * @throws {Error} If the input matrix is not symmetric.
 */
export function computeEigenvectorsFromCovarianceMatrix(covarianceMatrix: Matrix): Matrix {
  assert(covarianceMatrix.isSymmetric(), 'Compute eigenvectors from non symmetric covariance matrix.');
  const evd = new EVD(covarianceMatrix, { assumeSymmetric: true });
  const U = evd.eigenvectorMatrix;
  U.flipRows();
  return U;
}

/**
 * Calculates the variance explained by each principal component, in descending order.
 *
 * @param {Matrix} covarianceMatrix - The covariance matrix to compute the variance explained.
 * @returns {number[]} An array of variances explained by each principal component.
 * @throws {Error} If an error occurs during the PCA computation.
 */
export function calculateVarianceExplained(covarianceMatrix: Matrix): number[] {
  try {
    const eigenvalues = computeEigenvaluesFromCovarianceMatrix(covarianceMatrix);
    const totalVariance = eigenvalues.reduce((a, b) => a + b, 0);
    return eigenvalues.map((value) => value / totalVariance);
  } catch (e) {
    // may need to surface this error somewhere
    // console.error(`An error occurred during calculating variance explained: ${e}`);
    return [];
  }
}

/**
 * This function performs PCA on a data set using the covariance method, i.e, projecting the data
 * set onto the principal component space.
 *
 * It standardizes the dataset, ensuring all features have a mean of 0 and a standard deviation of 1
 * Then it calculates the covariance matrix. The eigenvectors of the covariance matrix are computed,
 * which are then used to transform the dataset. The complete transformed dataset is then returned.
 *
 * @param {Matrix} datasetMatrix - The dataset to perform PCA on, represented as a matrix.
 * @returns {Matrix} The complete transformed dataset. If an error occurs during the PCA computation
 * , an empty matrix is returned.
 */
export function computeCovariancePCA(datasetMatrix: Matrix): Matrix {
  try {
    const standardizedDataset = standardizeDataset(datasetMatrix);
    const covarianceMatrix = calculateCovarianceMatrix(standardizedDataset);
    const U = computeEigenvectorsFromCovarianceMatrix(covarianceMatrix);
    return datasetMatrix.mmul(U);
  } catch (e) {
    // may need to surface this error somewhere
    // console.log(`An error occurred during covariance PCA computation: ${e}`);
    return new Matrix(0, 0);
  }
}

/**
 * Selects a specific principal component (column) from a PCA-transformed dataset.
 *
 * @param {Matrix} transformedDataset - The PCA-transformed dataset.
 * @param {number} componentIndex - The index of the principal component to select.
 * @returns {Matrix} The selected principal component.
 * @throws {Error} If componentIndex is less than 0 or greater than or equal to the number of
 * columns in the dataset.
 */
export function selectPrincipalComponent(
  transformedDataset: Matrix,
  componentIndex: number,
): Matrix {
  assert(componentIndex >= 0 && componentIndex < transformedDataset.columns, `Invalid componentIndex value: ${componentIndex}`);
  return transformedDataset.subMatrix(
    0,
    transformedDataset.rows - 1,
    componentIndex,
    componentIndex,
  );
}
