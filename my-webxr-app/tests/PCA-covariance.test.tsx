import { Matrix } from 'ml-matrix';
import {  
    calculateCovarianceMatrix, 
    computeEigenvaluesFromCovarianceMatrix, 
    computeEigenvectorsFromCovarianceMatrix, 
    computeCovariancePCA 
} from '../src/utils/PCA-covariance';

let matrix: Matrix;
let covarianceMatrix: Matrix;

beforeEach(() => {
    const dataset = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
    matrix = new Matrix(dataset);
    covarianceMatrix = calculateCovarianceMatrix(matrix);
});

describe('calculateCovarianceMatrix', () => {
    test('returns a Matrix', () => {
        const covarianceMatrix = calculateCovarianceMatrix(matrix);
        expect(covarianceMatrix).toBeInstanceOf(Matrix);
    });

    test('returns a symmetric Matrix', () => {
        const covarianceMatrix = calculateCovarianceMatrix(matrix);
        expect(covarianceMatrix.isSymmetric()).toBe(true);
    });
});

describe('computeEigenvaluesFromCovarianceMatrix', () => {
    test('returns an array', () => {
        const eigenvalues = computeEigenvaluesFromCovarianceMatrix(covarianceMatrix);
        expect(eigenvalues).toBeInstanceOf(Array);
    });

    test('returns a symmetric matrix', () => {
        expect(covarianceMatrix.isSymmetric()).toBe(true);
    });
});

describe('computeEigenvectorsFromCovarianceMatrix', () => {
    test('returns a Matrix', () => {
        const eigenvectors = computeEigenvectorsFromCovarianceMatrix(covarianceMatrix);
        expect(eigenvectors).toBeInstanceOf(Matrix);
    });
});

describe('computePCA', () => {
    it('should compute PCA correctly', () => {
        const kComponents = 2;
        const result = computeCovariancePCA(matrix, kComponents);
        expect(result).toBeInstanceOf(Matrix);
        expect(result.columns).toBe(kComponents);
    });

    it('should throw an error if kComponents is invalid', () => {
        const kComponents = 4;
        expect(() => computeCovariancePCA(matrix, kComponents)).toThrow("Invalid kComponents value.");
    });
});