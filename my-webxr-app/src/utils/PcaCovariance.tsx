import { EVD, Matrix } from 'ml-matrix';
import assert from './Assert';
import { rollbar } from './LoggingUtils';

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
 * @param {Matrix} standardizedDataset - The dataset to calculate the covariance matrix for,
 * represented as a Matrix.
 * @returns {Matrix} The covariance matrix of the dataset. This matrix is symmetric.
 * @throws {Error} If the number of rows in the dataset is one or zero.
 */
export function calculateCovarianceMatrix(standardizedDataset: Matrix): Matrix {
  assert(standardizedDataset.rows !== 0, 'Data set of zero row!');
  assert(standardizedDataset.rows !== 1, 'Number of rows in the dataset is one, causing division by zero in covariance matrix calculation.');
  return standardizedDataset.transpose().mmul(standardizedDataset)
    .div(standardizedDataset.rows - 1);
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
 * Performs Principal Component Analysis (PCA) on a dataset using the covariance method.
 *
 * @param {Matrix} standardizedDataset - The standardized version of the original dataset.
 * @returns {Matrix} The transformed dataset in the principal component space. If an error occurs
 * during the PCA computation, an empty matrix is returned.
 * @throws {Error} If an error occurs during the PCA computation.
 */
export function computeCovariancePCA(standardizedDataset: Matrix): Matrix {
  try {
    const covarianceMatrix = calculateCovarianceMatrix(standardizedDataset);
    const U = computeEigenvectorsFromCovarianceMatrix(covarianceMatrix);
    return standardizedDataset.mmul(U);
  } catch (e) {
    rollbar.critical(`An error occurred during covariance PCA computation: ${e}`);
    return new Matrix(0, 0);
  }
}
