import { Matrix } from 'ml-matrix';
import {
  calculateCovarianceMatrix, computeCovariancePCA,
  computeEigenvaluesFromCovarianceMatrix,
  computeEigenvectorsFromCovarianceMatrix,
} from '../../src/utils/PcaCovariance';
import standardizeDataset from '../../src/utils/StandardizeDataset';

let matrix: Matrix;
let covarianceMatrix: Matrix;

beforeEach(() => {
  const dataset = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
  matrix = new Matrix(dataset);
  covarianceMatrix = calculateCovarianceMatrix(matrix);
});

describe('calculateCovarianceMatrix', () => {
  test('returns a Matrix', () => {
    expect(covarianceMatrix).toBeInstanceOf(Matrix);
  });

  test('returns a symmetric Matrix', () => {
    expect(covarianceMatrix.isSymmetric()).toBe(true);
  });

  it('should throw error if data set row is 0', () => {
    const dataset = new Matrix(0, 2);
    expect(() => calculateCovarianceMatrix(dataset)).toThrow();
  });

  it('should throw error if data set row is 1', () => {
    const dataset = new Matrix(1, 2);
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

  test('throws error if covarianceMatrix is not symmetric', () => {
    const eigenvalues = new Matrix([[1, 2], [3, 4]]);
    expect(() => computeEigenvaluesFromCovarianceMatrix(eigenvalues)).toThrow();
  });

  it('should compute eigenvalues correctly', () => {
    const dataset = new Matrix([
      [1, 2, 3, 4],
      [5, 5, 6, 7],
      [1, 4, 2, 3],
      [5, 3, 2, 1],
      [8, 1, 2, 2],
    ]);
    const standardizedDataset = standardizeDataset(dataset);
    covarianceMatrix = calculateCovarianceMatrix(standardizedDataset);
    const expected = [2.51579324, 1.0652885, 0.39388704, 0.02503121];
    const eigenvalues = computeEigenvaluesFromCovarianceMatrix(covarianceMatrix);
    for (let i = 0; i < eigenvalues.length; i += 1) {
      expect(eigenvalues[i]).toBeCloseTo(expected[i], 8);
    }
  });
});

describe('computeEigenvectorsFromCovarianceMatrix', () => {
  test('returns a Matrix', () => {
    const eigenvectors = computeEigenvectorsFromCovarianceMatrix(covarianceMatrix);
    expect(eigenvectors).toBeInstanceOf(Matrix);
  });

  test('throws error if covarianceMatrix is not symmetric', () => {
    const eigenvectors = new Matrix([[1, 2], [3, 4]]);
    expect(() => computeEigenvectorsFromCovarianceMatrix(eigenvectors)).toThrow();
  });

  it('should compute eigenvectors correctly', () => {
    const dataset = new Matrix([
      [1, 2, 3, 4],
      [5, 5, 6, 7],
      [1, 4, 2, 3],
      [5, 3, 2, 1],
      [8, 1, 2, 2],
    ]);
    const standardizedDataset = standardizeDataset(dataset);
    covarianceMatrix = calculateCovarianceMatrix(standardizedDataset);
    const expected: Matrix = new Matrix([
      [-0.161960, -0.917059, -0.307071, 0.196162],
      [0.524048, 0.206922, -0.817319, 0.120610],
      [0.585896, -0.320539, 0.188250, -0.720099],
      [0.596547, -0.115935, 0.449733, 0.654547],
    ]);
    const eigenvectors = computeEigenvectorsFromCovarianceMatrix(covarianceMatrix);
    for (let i = 0; i < eigenvectors.rows; i += 1) {
      for (let j = 0; j < eigenvectors.columns; j += 1) {
        expect(eigenvectors.get(i, j)).toBeCloseTo(expected.get(i, j), 6);
      }
    }
  });
});

describe('computePCA', () => {
  it('should compute and return PCA matrix', () => {
    const result = computeCovariancePCA(matrix);
    expect(result).toBeInstanceOf(Matrix);
  });

  it('should compute PCA correctly', () => {
    const dataset = new Matrix([
      [1, 2, 3, 4],
      [5, 5, 6, 7],
      [1, 4, 2, 3],
      [5, 3, 2, 1],
      [8, 1, 2, 2],
    ]);
    const standardizedDataset = standardizeDataset(dataset);
    const expected: Matrix = new Matrix([
      [-0.014003307840190604, 0.7559747649563959, 0.941199614594691, -0.10185222583403578],
      [2.5565339942868186, -0.7804317748323727, -0.10686986110059982, -0.00575705265323978],
      [0.051480191864712074, 1.2531347040524978, -0.39667339694231407, 0.18214124212185656],
      [-1.0141500183909433, 0.0002388083099344046, -0.6798861824511148, -0.20122464897453102],
      [-1.5798608599203967, -1.2289165024864557, 0.24222982589933767, 0.1266926853399502],
    ]);
    const covariancePCA = computeCovariancePCA(standardizedDataset);
    for (let i = 0; i < covariancePCA.rows; i += 1) {
      for (let j = 0; j < covariancePCA.columns; j += 1) {
        expect(covariancePCA.get(i, j)).toBeCloseTo(expected.get(i, j), 12);
      }
    }
  });

  it('should return empty Matrix if datasetMatrix is 1 by 1', () => {
    const datasetMatrix = new Matrix(1, 1);
    const result = computeCovariancePCA(datasetMatrix);
    expect(() => result.columns === 0 && result.rows === 0);
  });

  it('should return empty Matrix if datasetMatrix is 1 by 2', () => {
    const datasetMatrix = new Matrix(1, 2);
    const result = computeCovariancePCA(datasetMatrix);
    expect(() => result.columns === 0 && result.rows === 0);
  });

  it('should return empty Matrix if datasetMatrix is 2 by 1', () => {
    const datasetMatrix = new Matrix(2, 1);
    const result = computeCovariancePCA(datasetMatrix);
    expect(() => result.columns === 0 && result.rows === 0);
  });
});
