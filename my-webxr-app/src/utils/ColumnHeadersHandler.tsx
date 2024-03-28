/**
 * This function ensures that all column names in a given array are unique.
 * If a column name is repeated, it appends an underscore
 * and the count of occurrences to make it unique.
 * @precondition columnHeaders can't be null/undefined
 * @param {string[]} columnHeaders - An array of column names.
 * @returns {string[]} An array of unique column names.
 */
export default function handleColumnHeaders(columnHeaders: string[]): string[] {
  assert.ok(columnHeaders !== null, 'Column headers cannot be null');
  assert.ok(columnHeaders !== undefined, 'Column headers cannot be undefined');

  return columnHeaders.map((name, index) => {
    // Count the number of occurrences of the current name in the preceding part of the array
    const count = columnHeaders.slice(0, index).filter((n) => n === name).length;
    // If the name is repeated, append an underscore and the count to make it unique
    return count > 0 ? `${name}_${count}` : name;
  });
}
