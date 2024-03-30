/**
 * This imitates JavaScript's assert
 *
 * @pre-condition None
 * @post-condition throws an error if condition is false
 * @param condition A boolean to assert
 * @param msg The error message to display
 * @returns None
 * @throws AssertionError if expr is false
 */
export default function assert(condition: boolean, msg?: string): asserts condition {
  if (!condition) {
    throw new Error(msg);
  }
}
