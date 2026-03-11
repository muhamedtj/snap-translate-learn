export interface VocabWord {
  id: string;
  word: string;
  translation: string;
  language: string;
  example: string;
  mastered: boolean;
  srsLevel: number; // 0-5
  topicId: string;
}

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

export interface Topic {
  id: string;
  name: string;
  emoji: string;
  wordCount: number;
  language: string;
}

export interface Friend {
  id: string;
  name: string;
  avatar: string;
  xp: number;
}

export type StudyMode = "flashcards" | "audio" | "multipleChoice" | "writeTranslation";

export const studyModes: { id: StudyMode; emoji: string; labelKey: string }[] = [
  { id: "flashcards", emoji: "🃏", labelKey: "study.modes.flashcards" },
  { id: "audio", emoji: "🔊", labelKey: "study.modes.audio" },
  { id: "multipleChoice", emoji: "✅", labelKey: "study.modes.multipleChoice" },
  { id: "writeTranslation", emoji: "✍️", labelKey: "study.modes.writeTranslation" },
];

export const topics: Topic[] = [
  { id: "t1", name: "Fruit Vocabulary", emoji: "🍎", wordCount: 12, language: "French" },
  { id: "t2", name: "Kitchen", emoji: "🍳", wordCount: 8, language: "German" },
  { id: "t3", name: "Travel", emoji: "✈️", wordCount: 15, language: "Spanish" },
  { id: "t4", name: "Animals", emoji: "🐱", wordCount: 10, language: "Japanese" },
  { id: "t5", name: "Clothing", emoji: "👕", wordCount: 9, language: "French" },
];

export const friends: Friend[] = [
  { id: "f1", name: "Alex M.", avatar: "AM", xp: 1240 },
  { id: "f2", name: "Sarah K.", avatar: "SK", xp: 980 },
  { id: "f3", name: "John D.", avatar: "JD", xp: 870 },
];

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
      { id: "w1", word: "Bonjour", translation: "Hello", language: "French", example: "Bonjour, je suis Pierre.", mastered: true, srsLevel: 5, topicId: "t1" },
      { id: "w2", word: "Aujourd'hui", translation: "Today", language: "French", example: "Aujourd'hui il fait beau.", mastered: false, srsLevel: 2, topicId: "t1" },
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
      { id: "w3", word: "Katze", translation: "Cat", language: "German", example: "Die Katze schläft.", mastered: false, srsLevel: 1, topicId: "t2" },
      { id: "w4", word: "Tisch", translation: "Table", language: "German", example: "Der Tisch ist groß.", mastered: true, srsLevel: 4, topicId: "t2" },
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
      { id: "w5", word: "美しい", translation: "Beautiful", language: "Japanese", example: "美しい花です。", mastered: false, srsLevel: 0, topicId: "t4" },
      { id: "w6", word: "都市", translation: "City", language: "Japanese", example: "大きい都市です。", mastered: false, srsLevel: 3, topicId: "t4" },
    ],
  },
];

export const allVocabWords: VocabWord[] = mockSnaps.flatMap((s) => s.words);

export const availableLanguages = [...new Set(allVocabWords.map((w) => w.language))];

export const userStats = {
  totalSnaps: 24,
  wordsLearned: 87,
  streak: 5,
  masteredWords: 34,
  xp: 1350,
  wordsToReview: 8,
};

export const achievements = [
  { id: "a1", name: "7 Day Streak", emoji: "🔥", unlocked: true },
  { id: "a2", name: "First Snap", emoji: "📸", unlocked: true },
  { id: "a3", name: "100 Words", emoji: "📚", unlocked: false },
  { id: "a4", name: "Speed Learner", emoji: "⚡", unlocked: false },
];
