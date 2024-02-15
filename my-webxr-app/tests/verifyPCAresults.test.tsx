import { Matrix } from 'ml-matrix';
import { computeClassicPCA } from '../src/utils/PCA-classic';
import { computeCovariancePCA } from '../src/utils/PCA-covariance';

describe('PCA methods', () => {
    test('should return approximately the same results for both method, ignore sign', () => {
        const dataset = new Matrix([
            [1,2,3,4],
            [5,5,6,7],
            [1,4,2,3],
            [5,3,2,1],
            [8,1,2,2]
        ]);
        const covariancePCA = computeCovariancePCA(dataset, 4);
        const classicPCA = computeClassicPCA(dataset, 4);
        for (let i = 0; i < covariancePCA.rows; i++) {
            for (let j = 0; j < covariancePCA.columns; j++) {
              expect(Math.abs(covariancePCA.get(i, j))).toBeCloseTo(Math.abs(classicPCA.get(i, j)), 12);
            }
          }
    });
});