export default function WriteHook(text: string): boolean {
  try {
    const existingText = localStorage.getItem('myText') || '';
    const updatedText = existingText + text;
    localStorage.setItem('myText', updatedText);
    return true;
  } catch (error) {
    return false;
  }
}
