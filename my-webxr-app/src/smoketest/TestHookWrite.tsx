/**
 * Appends text to the test hook logging
 * @pre-condition env variable VITE_IS_TESTING is set to true
 * @post-condition a boolean of whether the text was successfully appended
 * @param {string} text text to write
 * @return {boolean} whether the text was successfully appended
 * @constructor
 */
export default function WriteHook(text: string): boolean {
  if (import.meta.env.VITE_IS_TESTING) {
    try {
      const existingText = localStorage.getItem('myText') || '';
      const updatedText = existingText + text;
      localStorage.setItem('myText', updatedText);
      return true;
    } catch (error) {
      return false;
    }
  }
  return false;
}
