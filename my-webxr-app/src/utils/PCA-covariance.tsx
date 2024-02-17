import {EVD, Matrix} from 'ml-matrix';
import assert from "./assert.tsx";
import {standardizeDataset} from "./standardizeDataset.tsx"

/** 
 * Inspired by: https://medium.com/analytics-vidhya/understanding-principle-component-analysis-pca-step-by-step-e7a4bb4031d9 
 * 
 * Steps involved in this method of PCA
 *    1: Standardize the dataset.
 *    2: Calculate the covariance matrix for the features in the dataset.
 *    3: Calculate the eigenvalues and eigenvectors for the covariance matrix and sort eigenvalues and their corresponding eigenvectors.
 *    4: Pick k eigenvalues and form a matrix of eigenvectors. Then take product of dataset and eigenvectors to form PCA matrix.
 * /

/**
 * Calculates the covariance matrix of the given dataset.
 * 
 * Formula: (X^T * X) * (1/(n-1))
 * 
 * @param {Matrix} dataSetMatrix - The dataset to calculate the covariance matrix for, represented as a Matrix.
 * @returns {Matrix} The covariance matrix of the dataset. This matrix is symmetric.
 * @throws {Error} If the number of rows in the dataset is one.
 */
export function calculateCovarianceMatrix(dataSetMatrix: Matrix): Matrix {
    assert(dataSetMatrix.rows !== 1, "Number of rows in the dataset is one, causing division by zero.");
    return dataSetMatrix.transpose().mmul(dataSetMatrix).div(dataSetMatrix.rows - 1);
}

/**
 * Computes the eigenvalues from a covariance matrix.
 * 
 * It uses Eigenvalue Decomposition (EVD) to compute the eigenvalues. The eigenvalues are then sorted in descending order, 
 * so that the first eigenvalue corresponds to the direction of maximum variance in the data, the second to the direction 
 * of second most variance, and so on.
 * 
 * @param {Matrix} covarianceMatrix - The covariance matrix from which to compute the eigenvalues.
 * @returns {number[]} An array of eigenvalues in descending order.
 * @throws {Error} If the input matrix is not symmetric.
 */
export function computeEigenvaluesFromCovarianceMatrix(covarianceMatrix: Matrix): number[] {
    assert(covarianceMatrix.isSymmetric(), "Compute eigenvalues from non symetric covariance matrix.");
    const evd = new EVD(covarianceMatrix, { assumeSymmetric: true });
    const S = evd.realEigenvalues;
    S.reverse();
    return S;
}

/**
 * Computes the eigenvectors from a covariance matrix.
 * 
 * It uses Eigenvalue Decomposition (EVD) to compute the eigenvectors. The eigenvectors are then sorted in descending order 
 * of their corresponding eigenvalues, so that the first eigenvector corresponds to the direction of maximum variance in the data, 
 * the second to the direction of second most variance, and so on.
 * 
 * @param {Matrix} covarianceMatrix - The covariance matrix from which to compute the eigenvectors.
 * @returns {Matrix} A matrix of eigenvectors (U).
 * @throws {Error} If the input matrix is not symmetric.
 */
export function computeEigenvectorsFromCovarianceMatrix(covarianceMatrix: Matrix): Matrix {
    assert(covarianceMatrix.isSymmetric(), "Compute eigenvectors from non symetric covariance matrix.");
    const evd = new EVD(covarianceMatrix, { assumeSymmetric: true });
    const U = evd.eigenvectorMatrix;
    U.flipRows();
    return U;
}

/**
 * This function performs PCA on a data set using covariance method.
 * 
 * It standardizes the dataset, ensuring all features have a mean of 0 and a standard deviation of 1.
 * Then calculates the covariance matrix.
 * The eigenvectors of the covariance matrix are computed, which are then used to transform the dataset.
 * The transformed dataset is then returned, with only the first kComponents principal components.
 * 
 * @param {Matrix} datasetMatrix - The dataset to perform PCA on, represented as a matrix.
 * @param {number} kComponents - The number of principal components to retain.
 * @returns {Matrix} The transformed dataset, with only the first kComponents principal components.
 * @throws {Error} If kComponent exceeds the dimensions of dataset or less than zero.
 * @throws {Error} If an error occurs during the PCA computation.
 */
export function computeCovariancePCA(datasetMatrix: Matrix, kComponents: number): Matrix {
    assert(kComponents > 0 && kComponents <= datasetMatrix.columns, "Invalid kComponents value.");
    try {
        datasetMatrix = standardizeDataset(datasetMatrix);
        const covarianceMatrix = calculateCovarianceMatrix(datasetMatrix);
        const U = computeEigenvectorsFromCovarianceMatrix(covarianceMatrix);
        const PCA = datasetMatrix.mmul(U);
        return PCA.subMatrix(0, PCA.rows - 1, 0, kComponents - 1);
    } catch (e) {
        console.log(`An error occurred during covariance PCA computation: ${e}`);
        return new Matrix(0, 0);
    }
}

