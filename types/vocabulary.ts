export type VocabularyItem = {
  id: string;
  english: string;
  vietnamese: string;
  pronunciation: string;
  example: string;
  imageSrc: string;
  category:
    | "food"
    | "school"
    | "daily"
    | "travel"
    | "work"
    | "environment"
    | "communication"
    | "society";
};

export type SentencePattern = {
  id: string;
  title: string;
  vietnamese: string;
  pattern: string;
  example: string;
  useCase: string;
  level: "B1";
};
