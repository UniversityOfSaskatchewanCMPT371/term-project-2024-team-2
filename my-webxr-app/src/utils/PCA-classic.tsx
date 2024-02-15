import { Matrix, SVD } from 'ml-matrix';
import assert from "./assert.tsx";
import {standardizeDataset} from "./standardizeDataset.tsx"

/**
 * Inspired by: https://jonathan-hui.medium.com/machine-learning-singular-value-decomposition-svd-principal-component-analysis-pca-1d45e885e491
 * 
 * Steps involved in this method of PCA
 *    1: Standardize the dataset.
 *    2: Calulate the k-th right singular vectors by performming singular value decomposition on dataset.
 *    3: Take product of dataset and k-th right singular vectors to form PCA matrix.
 */

/**
 * Perform SVD on a dataset and get the first k right singular vectors.
 * 
 * @param {Matrix} datasetMatrix - The dataset to perform SVD on.
 * @param {number} kComponents - The number of finals PCA components.
 * @return {Matrix} - The first k right singular vectors (has k-columns).
 */
export function getRightSingularVectors(datasetMatrix: Matrix, kComponents: number): Matrix {
    assert(kComponents > 0 && kComponents <= datasetMatrix.columns, "Invalid kComponents value.");
    const svd = new SVD(datasetMatrix, {
        computeLeftSingularVectors: false,
        computeRightSingularVectors: true,
        autoTranspose: true,
    });

    const rightSingularVectors = svd.rightSingularVectors;
    return rightSingularVectors.subMatrix(0, rightSingularVectors.rows - 1, 0, kComponents - 1);
}

/**
 * This function performs PCA on a data set using the Singular Value Decomposition (SVD) method, also known as Classic PCA.
 * 
 * It first standardizes the dataset, ensuring all features have a mean of 0 and a standard deviation of 1. 
 * It then computes the right singular vectors of the standardized dataset, which serve as the principal components. 
 * The dataset is then transformed by projecting it onto the principal components, and then returned. 
 * 
 * @param {Matrix} datasetMatrix - The dataset to perform PCA on, represented as a matrix where each row is an observation and each column is a feature.
 * @param {number} kComponents - The number of principal components to retain.
 * @returns {Matrix} The PCA-transformed dataset, with only the first kComponents principal components.
 * @throws {Error} If kComponents is less than 1 or greater than the number of features in the dataset.
 * @throws {Error} If an error occurs during the PCA computation.
 */
export function computeClassicPCA(datasetMatrix: Matrix, kComponents: number): Matrix {
    assert(kComponents > 0 && kComponents <= datasetMatrix.columns, "Invalid kComponents value.");
    try {
        datasetMatrix = standardizeDataset(datasetMatrix);
        const rightSingularVectors = getRightSingularVectors(datasetMatrix, kComponents);
        assert(kComponents == rightSingularVectors.columns, "Right Singular Vectors must have k-columns.")
        const PCA = datasetMatrix.mmul(rightSingularVectors);
        return PCA;
    } catch (e) {
        console.log(`An error occurred during classic PCA computation: ${e}`);
        return new Matrix(0, 0);
    }
}