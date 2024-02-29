import {Matrix} from 'ml-matrix';
import * as assert from "assert";

/**
 * Standardizes the given dataset.
 * 
 * This is done by subtracting the mean and dividing by the standard deviation for each feature independently.
 * If the standard deviation of a feature is zero, that feature is left unchanged.
 * 
 * @param {Matrix} dataSetMatrix - The dataset to standardize, represented as a Matrix.
 * @returns {Matrix}The standardized matrix of dataset.
 */
export function standardizeDataset(dataSetMatrix: Matrix): Matrix {
    assert.equal(dataSetMatrix.rows >= 2 && dataSetMatrix.columns >= 2, true, "Invalid data set: "+ dataSetMatrix.rows + " rows, " + dataSetMatrix.columns + " colums.");
    const mean = dataSetMatrix.mean('column');
    const stdevs = dataSetMatrix.standardDeviation('column', { mean });

    for (let i = 0; i < dataSetMatrix.columns; i++) {
        if (stdevs[i] === 0) {
            // Skip standardization for this column
            continue;
        }
        for (let j = 0; j < dataSetMatrix.rows; j++) {
            const standardizedValue = (dataSetMatrix.get(j, i) - mean[i]) / stdevs[i];
            dataSetMatrix.set(j, i, standardizedValue);
        }
    }
    return dataSetMatrix;
}