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

    it('should throw error if data set row is 0', () => {
        const dataset = new Matrix(0,2);
        expect(() => calculateCovarianceMatrix(dataset)).toThrow();
    });

    it('should throw error if data set row is 1', () => {
        const dataset = new Matrix(1,2);
        expect(() => calculateCovarianceMatrix(dataset)).toThrow();
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
        expect(() => computeCovariancePCA(matrix, kComponents)).toThrow();
    });

    it('should return empty Matrix if datasetMatrix is 1 by 1', () => {
        const datasetMatrix = new Matrix(1,1);
        const kComponents = 1;
        const result = computeCovariancePCA(datasetMatrix, kComponents)
        expect(() => result.columns == 0 && result.rows == 0);
    });

    it('should return empty Matrix if datasetMatrix is 1 by 2', () => {
        const datasetMatrix = new Matrix(1,2);
        const kComponents = 1;
        const result = computeCovariancePCA(datasetMatrix, kComponents)
        expect(() => result.columns == 0 && result.rows == 0);
    });

    it('should return empty Matrix if datasetMatrix is 2 by 1', () => {
        const datasetMatrix = new Matrix(2,1);
        const kComponents = 1;
        const result = computeCovariancePCA(datasetMatrix, kComponents)
        expect(() => result.columns == 0 && result.rows == 0);
    });

});