import {standardizeDataset} from "../src/utils/standardizeDataset.tsx";
import {Matrix} from 'ml-matrix';

const dataset = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
const matrix = new Matrix(dataset);

describe('standardizeDataset', () => {
    test('returns a Matrix', () => {
        const standardized = standardizeDataset(matrix);
        expect(standardized).toBeInstanceOf(Matrix);
    });
});