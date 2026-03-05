export interface Snap {
  id: string;
  imageUrl: string;
  originalText: string;
  translation: string;
  language: string;
  grammarNotes: string;
  createdAt: string;
  words: VocabWord[];
}

export interface VocabWord {
  id: string;
  word: string;
  translation: string;
  language: string;
  example: string;
  mastered: boolean;
}

export const mockSnaps: Snap[] = [
  {
    id: "1",
    imageUrl: "https://images.unsplash.com/photo-1504711434969-e33886168d5c?w=400&h=300&fit=crop",
    originalText: "Bonjour, comment allez-vous aujourd'hui?",
    translation: "Hello, how are you today?",
    language: "French",
    grammarNotes: "• \"Bonjour\" is a formal greeting used during the day.\n• \"Comment allez-vous\" uses the formal \"vous\" form.\n• \"Aujourd'hui\" means \"today\" — it's an adverb of time.",
    createdAt: "2026-03-05",
    words: [
      { id: "w1", word: "Bonjour", translation: "Hello", language: "French", example: "Bonjour, je suis Pierre.", mastered: true },
      { id: "w2", word: "Aujourd'hui", translation: "Today", language: "French", example: "Aujourd'hui il fait beau.", mastered: false },
    ],
  },
  {
    id: "2",
    imageUrl: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=300&fit=crop",
    originalText: "Die Katze sitzt auf dem Tisch.",
    translation: "The cat is sitting on the table.",
    language: "German",
    grammarNotes: "• \"Die Katze\" — feminine noun with definite article.\n• \"sitzt\" — 3rd person singular of \"sitzen\".\n• \"auf dem Tisch\" — dative case after \"auf\" (location).",
    createdAt: "2026-03-04",
    words: [
      { id: "w3", word: "Katze", translation: "Cat", language: "German", example: "Die Katze schläft.", mastered: false },
      { id: "w4", word: "Tisch", translation: "Table", language: "German", example: "Der Tisch ist groß.", mastered: true },
    ],
  },
  {
    id: "3",
    imageUrl: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&h=300&fit=crop",
    originalText: "東京は美しい都市です。",
    translation: "Tokyo is a beautiful city.",
    language: "Japanese",
    grammarNotes: "• \"東京\" (Tōkyō) — proper noun.\n• \"美しい\" (utsukushii) — i-adjective meaning beautiful.\n• \"都市\" (toshi) — noun meaning city.\n• \"です\" (desu) — polite copula.",
    createdAt: "2026-03-03",
    words: [
      { id: "w5", word: "美しい", translation: "Beautiful", language: "Japanese", example: "美しい花です。", mastered: false },
      { id: "w6", word: "都市", translation: "City", language: "Japanese", example: "大きい都市です。", mastered: false },
    ],
  },
];

export const allVocabWords: VocabWord[] = mockSnaps.flatMap((s) => s.words);

export const userStats = {
  totalSnaps: 24,
  wordsLearned: 87,
  streak: 5,
  masteredWords: 34,
};
