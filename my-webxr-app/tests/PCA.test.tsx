import { Matrix } from 'ml-matrix';
import { 
    convertToMatrix, 
    standardizeDataset, 
    calculateCovarianceMatrix, 
    isSymmetricMatrix,
    computeEigenvaluesFromCovarianceMatrix, 
    computeEigenvectorsFromCovarianceMatrix, 
    computePCA 
} from '../src/utils/PCA';

const dataset = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
const matrix = new Matrix(dataset);

describe('convertToMatrix', () => {
    test('converts array to Matrix', () => {
        expect(convertToMatrix(dataset)).toBeInstanceOf(Matrix);
    });

    test('returns same Matrix if input is Matrix', () => {
        expect(convertToMatrix(matrix)).toBe(matrix);
    });
});

describe('standardizeDataset', () => {
    test('returns a Matrix', () => {
        const standardized = standardizeDataset(matrix);
        expect(standardized).toBeInstanceOf(Matrix);
    });
});

describe('calculateCovarianceMatrix', () => {
    test('returns a Matrix', () => {
        const covarianceMatrix = calculateCovarianceMatrix(matrix);
        expect(covarianceMatrix).toBeInstanceOf(Matrix);
    });
});

describe('isSymmetricMatrix', () => {
    test('returns true for symmetric matrix', () => {
        const symmetricMatrix = new Matrix([[1, 2, 3], [2, 1, 4], [3, 4, 1]]);
        expect(isSymmetricMatrix(symmetricMatrix)).toBe(true);
    });

    test('returns false for non-symmetric matrix', () => {
        const nonSymmetricMatrix = new Matrix([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);
        expect(isSymmetricMatrix(nonSymmetricMatrix)).toBe(false);
    });
});

describe('computeEigenvaluesFromCovarianceMatrix', () => {
    test('returns an array', () => {
        const covarianceMatrix = calculateCovarianceMatrix(matrix);
        const eigenvalues = computeEigenvaluesFromCovarianceMatrix(covarianceMatrix);
        expect(eigenvalues).toBeInstanceOf(Array);
    });

    test('returns a symmetric matrix', () => {
        const covarianceMatrix = calculateCovarianceMatrix(matrix);
        expect(isSymmetricMatrix(covarianceMatrix)).toBe(true);
    });
});

describe('computeEigenvectorsFromCovarianceMatrix', () => {
    test('returns a Matrix', () => {
        const covarianceMatrix = calculateCovarianceMatrix(matrix);
        const eigenvectors = computeEigenvectorsFromCovarianceMatrix(covarianceMatrix);
        expect(eigenvectors).toBeInstanceOf(Matrix);
    });
});

describe('computePCA', () => {
    test('throws error if kComponents is greater than number of columns', () => {
        expect(() => computePCA(matrix, matrix.columns + 1)).toThrow();
    });

    test('does not throw error if kComponents is less than or equal to number of columns', () => {
        expect(() => computePCA(matrix, matrix.columns)).not.toThrow();
        expect(() => computePCA(matrix, matrix.columns - 1)).not.toThrow();
    });

    test('returns a matrix with kComponents columns', () => {
        const kComponents = 2;
        const pca = computePCA(matrix, kComponents);
        expect(pca).toBeInstanceOf(Matrix);
        expect(pca.columns).toBe(kComponents);
    });
});