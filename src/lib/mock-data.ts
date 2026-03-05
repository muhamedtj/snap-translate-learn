export interface VocabWord {
  id: string;
  word: string;
  translation: string;
  language: string;
  example: string;
  correctCount: number; // 0-5, 5 = learnt
  nextReview: string | null; // ISO date string
  createdAt: string;
  snapId: string;
}

export interface Snap {
  id: string;
  imageUrl: string;
  originalText: string;
  translation: string;
  language: string;
  grammarNotes: string;
  createdAt: string;
  wordIds: string[];
}

export const allWords: VocabWord[] = [
  { id: "w1", word: "Bonjour", translation: "Hello", language: "French", example: "Bonjour, je suis Pierre.", correctCount: 5, nextReview: null, createdAt: "2026-03-05", snapId: "1" },
  { id: "w2", word: "Aujourd'hui", translation: "Today", language: "French", example: "Aujourd'hui il fait beau.", correctCount: 2, nextReview: "2026-03-12", createdAt: "2026-03-05", snapId: "1" },
  { id: "w3", word: "Comment", translation: "How", language: "French", example: "Comment vas-tu?", correctCount: 3, nextReview: "2026-03-10", createdAt: "2026-03-05", snapId: "1" },
  { id: "w4", word: "Katze", translation: "Cat", language: "German", example: "Die Katze schläft.", correctCount: 1, nextReview: "2026-03-08", createdAt: "2026-03-04", snapId: "2" },
  { id: "w5", word: "Tisch", translation: "Table", language: "German", example: "Der Tisch ist groß.", correctCount: 4, nextReview: "2026-04-04", createdAt: "2026-03-04", snapId: "2" },
  { id: "w6", word: "sitzen", translation: "To sit", language: "German", example: "Ich sitze auf dem Stuhl.", correctCount: 0, nextReview: null, createdAt: "2026-03-04", snapId: "2" },
  { id: "w7", word: "美しい", translation: "Beautiful", language: "Japanese", example: "美しい花です。", correctCount: 1, nextReview: "2026-03-09", createdAt: "2026-03-03", snapId: "3" },
  { id: "w8", word: "都市", translation: "City", language: "Japanese", example: "大きい都市です。", correctCount: 0, nextReview: null, createdAt: "2026-03-03", snapId: "3" },
  { id: "w9", word: "Merci", translation: "Thank you", language: "French", example: "Merci beaucoup!", correctCount: 5, nextReview: null, createdAt: "2026-03-02", snapId: "4" },
  { id: "w10", word: "Bibliothèque", translation: "Library", language: "French", example: "Je vais à la bibliothèque.", correctCount: 3, nextReview: "2026-03-11", createdAt: "2026-03-02", snapId: "4" },
];

export const mockSnaps: Snap[] = [
  {
    id: "1",
    imageUrl: "https://images.unsplash.com/photo-1504711434969-e33886168d5c?w=400&h=300&fit=crop",
    originalText: "Bonjour, comment allez-vous aujourd'hui?",
    translation: "Hello, how are you today?",
    language: "French",
    grammarNotes: "• \"Bonjour\" is a formal greeting.\n• \"Comment allez-vous\" uses the formal \"vous\" form.\n• \"Aujourd'hui\" means \"today\".",
    createdAt: "2026-03-05",
    wordIds: ["w1", "w2", "w3"],
  },
  {
    id: "2",
    imageUrl: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=300&fit=crop",
    originalText: "Die Katze sitzt auf dem Tisch.",
    translation: "The cat is sitting on the table.",
    language: "German",
    grammarNotes: "• \"Die Katze\" — feminine noun.\n• \"sitzt\" — 3rd person singular of \"sitzen\".\n• \"auf dem Tisch\" — dative case.",
    createdAt: "2026-03-04",
    wordIds: ["w4", "w5", "w6"],
  },
  {
    id: "3",
    imageUrl: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&h=300&fit=crop",
    originalText: "東京は美しい都市です。",
    translation: "Tokyo is a beautiful city.",
    language: "Japanese",
    grammarNotes: "• \"美しい\" — i-adjective meaning beautiful.\n• \"都市\" — noun meaning city.\n• \"です\" — polite copula.",
    createdAt: "2026-03-03",
    wordIds: ["w7", "w8"],
  },
  {
    id: "4",
    imageUrl: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400&h=300&fit=crop",
    originalText: "Merci pour la bibliothèque.",
    translation: "Thank you for the library.",
    language: "French",
    grammarNotes: "• \"Merci\" — common expression of gratitude.\n• \"Bibliothèque\" — feminine noun.",
    createdAt: "2026-03-02",
    wordIds: ["w9", "w10"],
  },
];

export const getWordsForSnap = (snapId: string): VocabWord[] =>
  allWords.filter((w) => w.snapId === snapId);

export const userStats = {
  totalSnaps: mockSnaps.length,
  wordsLearned: allWords.filter((w) => w.correctCount >= 5).length,
  totalWords: allWords.length,
  streak: 5,
};

export const getWordStatus = (word: VocabWord): string => {
  if (word.correctCount >= 5) return "Learnt";
  if (word.correctCount >= 3) return "Reviewing";
  if (word.correctCount >= 1) return "Learning";
  return "New";
};

export const getNextReviewDate = (correctCount: number): string | null => {
  if (correctCount >= 5) return null;
  const now = new Date();
  if (correctCount >= 4) {
    now.setMonth(now.getMonth() + 1);
  } else if (correctCount >= 3) {
    now.setDate(now.getDate() + 7);
  } else {
    now.setDate(now.getDate() + 1);
  }
  return now.toISOString().split("T")[0];
};
