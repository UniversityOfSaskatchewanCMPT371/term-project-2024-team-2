import { v4 as uuidv4 } from 'uuid';
/**
 * This function ensures that all column names in a given array are unique.
 * @precondition columnHeaders can't be null/undefined
 * @postcondition columnHeaders will be unique in the returned array
 * - If a column name is repeated, it appends an underscore
 * and the count of occurrences to make it unique.
 * - If a column name is empty, it replaces it with a column_[columnIndex].
 * @param {string[]} columnHeaders - An array of column names.
 * @returns {string[]} An array of unique column names.
 */
export default function handleColumnHeaders(columnHeaders: string[]): string[] {
  return columnHeaders.map((columnHeader, index) => {
    const name = columnHeader.trim();

    // If the name is empty, replace it with a default name
    if (name === '') {
      return `column_${index + 1}_${uuidv4()}`;
    }

    // Count the number of occurrences of the current name in the preceding part of the array
    const count = columnHeaders.slice(0, index).filter((n) => n === name).length;
    // If the name is repeated, append an underscore and the count to make it unique
    return count > 0 ? `${name}_${count}` : name;
  });
}
