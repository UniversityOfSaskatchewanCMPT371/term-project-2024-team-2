export default function WriteHook(text: string): boolean {
  console.log(process.env.IS_TESTING)
  if (process.env.IS_TESTING) {
    try {
      const existingText = localStorage.getItem('myText') || '';
      const updatedText = existingText + text;
      localStorage.setItem('myText', updatedText);
      return true;
    } catch (error) {
      return false;
    }
  }
}
