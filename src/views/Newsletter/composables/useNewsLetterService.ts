import { NewsLetter } from "../services/NewsLetter.service";

const newsLetterService = new NewsLetter();

export function useNewsLetterService() {
  return { newsLetterService };
}
