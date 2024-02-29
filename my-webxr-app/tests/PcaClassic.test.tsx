import { Matrix } from 'ml-matrix';
import { getRightSingularVectors, computeClassicPCA } from '../src/utils/PcaClassic';

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
    it('should compute and return k-columns PCA matrix', () => {
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
    
    it('should compute PCA correctly', () => {
        const dataset = new Matrix([
            [1,2,3,4],
            [5,5,6,7],
            [1,4,2,3],
            [5,3,2,1],
            [8,1,2,2]
        ]);
        const expected:Matrix = new Matrix([
            [0.014003307840190854, 0.7559747649563956, -0.9411996145946913, 0.10185222583403639],
            [-2.556533994286821, -0.7804317748323719, 0.10686986110060037, 0.00575705265323978],
            [-0.051480191864711825, 1.2531347040524985, 0.396673396942314, -0.18214124212185673],
            [1.014150018390944, 0.00023880830993423807, 0.6798861824511147, 0.20122464897453068],
            [1.5798608599203976, -1.2289165024864566, -0.24222982589933784, -0.12669268533995032]
        ]);
        const PCA = computeClassicPCA(dataset, 4);
        for (let i = 0; i < PCA.rows; i++) {
            for (let j = 0; j < PCA.columns; j++) {
              expect(PCA.get(i, j)).toBeCloseTo(expected.get(i, j), 12);
            }
        }
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