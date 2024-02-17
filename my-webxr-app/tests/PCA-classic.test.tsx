import { Matrix } from 'ml-matrix';
import { getRightSingularVectors, computeClassicPCA } from '../src/utils/PCA-classic';

describe('getRightSingularVectors', () => {
    it('should return the first k right singular vectors', () => {
        const datasetMatrix = new Matrix([
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9]
        ]);
        const kComponents = 2;
        const result = getRightSingularVectors(datasetMatrix, kComponents);
        expect(result.columns).toBe(kComponents);
    });

    it('should return the first k=1 right singular vectors', () => {
        const datasetMatrix = new Matrix([
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9]
        ]);
        const kComponents = 1;
        const result = getRightSingularVectors(datasetMatrix, kComponents);
        expect(result.columns).toBe(kComponents);
    });

    it('should throw an error if kComponents is zero', () => {
        const datasetMatrix = new Matrix([
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9]
        ]);
        const kComponents = 0;
        expect(() => getRightSingularVectors(datasetMatrix, kComponents)).toThrow();
    });

    it('should throw an error if kComponents is larger than datasetMatrix column numbers', () => {
        const datasetMatrix = new Matrix([
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9]
        ]);
        const kComponents = 4;
        expect(() => getRightSingularVectors(datasetMatrix, kComponents)).toThrow();
    });

    it('should throw an error if datasetMatrix is empty', () => {
        const datasetMatrix = new Matrix([]);
        const kComponents = 1;
        expect(() => getRightSingularVectors(datasetMatrix, kComponents)).toThrow();
    });

    it('should mot throw error if the datasetMatrix has negative values', () => {
        const datasetMatrix = new Matrix([
            [1, -12, 3],
            [4, 5, -6],
            [-7, 8, 9]
        ]);
        const kComponents = 2;
        const result = getRightSingularVectors(datasetMatrix, kComponents);
        expect(result.columns).toBe(kComponents);
    });
});

describe('computeClassicPCA', () => {
    it('should compute PCA correctly for a simple dataset', () => {
        const datasetMatrix = new Matrix([
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9]
        ]);
        const kComponents = 2;
        const result = computeClassicPCA(datasetMatrix, kComponents);
        expect(result).toBeInstanceOf(Matrix);
        expect(result.columns).toBe(kComponents);
    });

    it('should throw an error if kComponents is invalid', () => {
        const datasetMatrix = new Matrix([
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9]
        ]);
        const kComponents = 4; 
        expect(() => computeClassicPCA(datasetMatrix, kComponents)).toThrow();
    });

    it('should return empty Matrix if datasetMatrix is 1 by 1', () => {
        const datasetMatrix = new Matrix(1,1);
        const kComponents = 1;
        const result = computeClassicPCA(datasetMatrix, kComponents)
        expect(() => result.columns == 0 && result.rows == 0);
    });

    it('should return empty Matrix if datasetMatrix is 1 by 2', () => {
        const datasetMatrix = new Matrix(1,2);
        const kComponents = 1;
        const result = computeClassicPCA(datasetMatrix, kComponents)
        expect(() => result.columns == 0 && result.rows == 0);
    });

    it('should return empty Matrix if datasetMatrix is 2 by 1', () => {
        const datasetMatrix = new Matrix(2,1);
        const kComponents = 1;
        const result = computeClassicPCA(datasetMatrix, kComponents)
        expect(() => result.columns == 0 && result.rows == 0);
    });

});