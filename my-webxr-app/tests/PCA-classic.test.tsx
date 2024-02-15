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

    it('should throw an error if kComponents is invalid', () => {
        const datasetMatrix = new Matrix([
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9]
        ]);
        const kComponents = 4;
        expect(() => getRightSingularVectors(datasetMatrix, kComponents)).toThrow();
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
});