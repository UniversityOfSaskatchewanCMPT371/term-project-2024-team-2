// import * as dotenv from "dotenv";
// dotenv.config({ path:'.env' });

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
  return false
}
