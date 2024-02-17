import {standardizeDataset} from "../src/utils/standardizeDataset.tsx";
import {Matrix} from 'ml-matrix';

describe('standardizeDataset', () => {
    test('returns a Matrix', () => {
        const datasetMatrix = new Matrix([
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9]
        ]);
        const standardized = standardizeDataset(datasetMatrix);
        expect(standardized).toBeInstanceOf(Matrix);
    });

    it('should throw an error if Matrix is empty', () => {
        const datasetMatrix = new Matrix([]);
        expect(() => standardizeDataset(datasetMatrix)).toThrow();
    });

    it('should throw an error if Matrix is 1 by 1', () => {
        const datasetMatrix = new Matrix(1,1);
        expect(() => standardizeDataset(datasetMatrix)).toThrow();
    });

    it('should throw an error if Matrix is 2 by 1', () => {
        const datasetMatrix = new Matrix(2,1);
        expect(() => standardizeDataset(datasetMatrix)).toThrow();
    });

    it('should throw an error if Matrix is 1 by 2', () => {
        const datasetMatrix = new Matrix(1,2);
        expect(() => standardizeDataset(datasetMatrix)).toThrow();
    });
});