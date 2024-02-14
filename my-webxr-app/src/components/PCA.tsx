import { Matrix, EVD } from 'ml-matrix';

/** 
 * Inspired by: https://medium.com/analytics-vidhya/understanding-principle-component-analysis-pca-step-by-step-e7a4bb4031d9 
 * 
 * Steps Involved in the PCA
 *    1: Standardize the dataset.
 *    2: Calculate the covariance matrix for the features in the dataset.
 *    3: Calculate the eigenvalues and eigenvectors for the covariance matrix and sort eigenvalues and their corresponding eigenvectors.
 *    4: Pick k eigenvalues and form a matrix of eigenvectors. Then Transform the original matrix.
 * 
 * Note: assertions in some functions could be turn on/off and passed to inner function to reduce computations.
*/

type MaybeMatrix = number[][] | Matrix;

/**
 * Converts the input dataset into a Matrix.
 * 
 * If the dataset is already a Matrix, it is returned as is. If the dataset is a 2D array of numbers, it is converted into a Matrix.
 * 
 * @param dataset - The dataset to convert into a Matrix. This can be a Matrix or a 2D array of numbers.
 * @param assert - Optional. Whether to enable assertions. Default is true.
 * @returns The dataset as a Matrix.
 * @throws {Error} If the input dataset is an array but not a 2D array.
 */
export function convertToMatrix(dataset: MaybeMatrix, assert: boolean = true): Matrix {
    let datasetMatrix: Matrix;
    if (Array.isArray(dataset)) {
        // Lazy evaluation, assert is false the rest of condition will not be evaluated, reducing computation.
        if (assert && !dataset.every(subArray => Array.isArray(subArray))) {
            throw new Error("The input dataset must be a 2D array of numbers.");
        }
        datasetMatrix = new Matrix(dataset);
    } else {
        datasetMatrix = dataset;
    } 
    return datasetMatrix;
}

/**
 * Standardizes the given dataset.
 * 
 * This is done by subtracting the mean and dividing by the standard deviation for each feature independently.
 * 
 * @param dataSetMatrix - The dataset to standardize, represented as a Matrix.
 * @param assert - Optional. Whether to check if the standard deviation is zero. Default is true.
 * @returns The standardized matrix of dataset.
 * @throws {Error} If the standard deviation of a column in the dataset is zero and assert is true.
 */
export function standardizeDataset(dataSetMatrix: Matrix, assert: boolean = true): Matrix {
    const mean = dataSetMatrix.mean('column');
    const stdevs = dataSetMatrix.standardDeviation('column', { mean });

    if (assert) {
        stdevs.forEach(stdDev => {
            if (stdDev === 0) {
                throw new Error("Standard deviation of a column in the dataset is zero, causing division by zero.");
            }
        });
    }

    dataSetMatrix.subRowVector(mean);
    dataSetMatrix.divRowVector(stdevs);
    return dataSetMatrix;
}

/**
 * Calculates the covariance matrix of the given dataset.
 * 
 * (X^T * X) * (1/(n-1))
 * 
 * @param dataSetMatrix - The dataset to calculate the covariance matrix for, represented as a Matrix.
 * @param assert - Optional. Whether to check if dataset has one row. Default is true.
 * @returns The covariance matrix of the dataset. This matrix is symmetric.
 * @throws {Error} If the number of rows in the dataset is one and assert is true.
 */
export function calculateCovarianceMatrix(dataSetMatrix: Matrix, assert: boolean = true): Matrix {
    if (assert && dataSetMatrix.rows === 1) {
        throw new Error("Number of rows in the dataset is one, causing division by zero.");
    }
    return dataSetMatrix.transpose().mmul(dataSetMatrix).div(dataSetMatrix.rows - 1);
}

/**
 * Checks if a matrix is symmetric.
 * 
 * X ?= X^T
 * 
 * @param matrix - The matrix to check.
 * @returns True if the matrix is symmetric, false otherwise.
 */
function isSymmetricMatrix(matrix: Matrix): boolean {
    const transpose = matrix.transpose();
    for (let i = 0; i < matrix.rows; i++) {
        for (let j = 0; j < matrix.columns; j++) {
            if (matrix.get(i, j) !== transpose.get(i, j)) {
                return false;
            }
        }
    }
    return true;
}

/**
 * Computes the eigenvalues from a covariance matrix.
 * 
 * It uses Eigenvalue Decomposition (EVD) to compute the eigenvalues. The eigenvalues are then sorted in descending order, 
 * so that the first eigenvalue corresponds to the direction of maximum variance in the data, the second to the direction 
 * of second most variance, and so on.
 * 
 * @param covarianceMatrix - The covariance matrix to compute the eigenvalues from.
 * @param checkSymmetry - Optional. Whether to check if the input matrix is symmetric. Default is true.
 * @returns An array of eigenvalues (S).
 * @throws {Error} If the input matrix is not symmetric and checkSymmetry is true.
 */
export function computeEigenvaluesFromCovarianceMatrix(covarianceMatrix: Matrix, checkSymmetry: boolean = true): number[] {
    // Lazy evaluation, checkSymmetry is false the rest of condition will not be evaluated, reducing computation.
    if (checkSymmetry && !isSymmetricMatrix(covarianceMatrix)) {
        throw new Error("The input matrix must be symmetric.");
    }
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
 * @param covarianceMatrix - The covariance matrix to compute the eigenvectors from.
 * @param checkSymmetry - Optional. Whether to check if the input matrix is symmetric. Default is true.
 * @returns A matrix of eigenvectors (U).
 * @throws {Error} If the input matrix is not symmetric and checkSymmetry is true.
 */
export function computeEigenvectorsFromCovarianceMatrix(covarianceMatrix: Matrix, checkSymmetry: boolean = true): Matrix {
    // Lazy evaluation, checkSymmetry is false the rest of condition will not be evaluated, reducing computation.
    if (checkSymmetry && !isSymmetricMatrix(covarianceMatrix)) {
        throw new Error("The input matrix must be symmetric.");
    }
    const evd = new EVD(covarianceMatrix, { assumeSymmetric: true });
    const U = evd.eigenvectorMatrix;
    U.flipRows();
    return U;
}


/**
 * Performs Principal Component Analysis (PCA) on the input dataset.
 * 
 * The function first converts the input to a Matrix if it's not already one. Then, the dataset is standardized.
 * The covariance matrix of the standardized dataset is calculated next.
 * The eigenvectors of the covariance matrix are computed and used to transform the dataset into the principal component space.
 * The transformed dataset is then truncated to only include the first kComponents principal components.
 * 
 * @param datasetMatrix - The dataset to perform PCA on. This can be a Matrix or a data structure that can be converted to a Matrix.
 * @param kComponents - The number of principal components to keep.
 * @param assert - Optional. Whether to enable assertions. Default is true. Turn off to reduce computations.
 * @returns The transformed dataset, as a first principal kComponents  Matrix.
 * @throws {Error} If the input dataset is not a Matrix or a 2D array and assert is true.
 */
export function computePCA(datasetMatrix: MaybeMatrix, kComponents: number, assert: boolean = true): Matrix {
    datasetMatrix = convertToMatrix(datasetMatrix, assert);
    datasetMatrix = standardizeDataset(datasetMatrix, assert);

    const covarianceMatrix = calculateCovarianceMatrix(datasetMatrix, assert);
    const U = computeEigenvectorsFromCovarianceMatrix(covarianceMatrix, assert);

    const predictions = datasetMatrix.mmul(U);
    return predictions.subMatrix(0, predictions.rows - 1, 0, kComponents - 1);
}