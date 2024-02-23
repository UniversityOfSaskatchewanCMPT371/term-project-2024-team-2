
/**
 * Typescript has no native assertion support. This imitates JavaScript's assert
 *
 * @throws AssertionError if expr is false
 *
 * @returns: None
 * @param condition
 * @param msg
 * **/
export default function assert(condition: boolean, msg?: string): asserts condition {
    if (!condition) {
        throw new Error(msg);
    }
}