import type { Localized } from "./schema"

/**
 * Default headings and the few words the templates print themselves ("Words", "Answers").
 * Only languages we can write correctly are listed; anything else starts empty and the teacher
 * fills it in. Never machine-translate here.
 */
type Phrase =
  | "objectives"
  | "introduction"
  | "culturalNote"
  | "vocabulary"
  | "examples"
  | "spotlight"
  | "abbreviations"
  | "textImage"
  | "gallery"
  | "exerciseTime"
  | "fillBlank"
  | "fillBlankInstructions"
  | "dialogue"
  | "thanks"
  | "closingMessage"
  | "words"
  | "answers"
  | "answerKey"
  | "cont"
  | "topic"
  | "translation"

const TABLE: Record<string, Record<Phrase, string>> = {
  en: {
    objectives: "Lesson objectives",
    introduction: "Introduction",
    culturalNote: "Cultural note",
    vocabulary: "Vocabulary",
    examples: "Examples",
    spotlight: "Word spotlight",
    abbreviations: "Abbreviations",
    textImage: "A closer look",
    gallery: "Look at these",
    exerciseTime: "Exercise time",
    fillBlank: "Complete the sentences",
    fillBlankInstructions: "Use the words below.",
    dialogue: "Dialogue",
    thanks: "Thank you!",
    closingMessage: "See you at the next session.",
    words: "Words",
    answers: "Answers",
    answerKey: "Answer key",
    cont: "cont.",
    topic: "Topic",
    translation: "Translation",
  },
  es: {
    objectives: "Objetivos de la clase",
    introduction: "Introducción",
    culturalNote: "Nota cultural",
    vocabulary: "Vocabulario",
    examples: "Ejemplos",
    spotlight: "Palabra destacada",
    abbreviations: "Abreviaturas",
    textImage: "Una mirada más cercana",
    gallery: "Mira esto",
    exerciseTime: "Hora de los ejercicios",
    fillBlank: "Completa las frases",
    fillBlankInstructions: "Usa las palabras de abajo.",
    dialogue: "Diálogo",
    thanks: "¡Gracias!",
    closingMessage: "Nos vemos en la próxima sesión.",
    words: "Palabras",
    answers: "Respuestas",
    answerKey: "Respuestas",
    cont: "cont.",
    topic: "Tema",
    translation: "Traducción",
  },
  pt: {
    objectives: "Objetivos da aula",
    introduction: "Introdução",
    culturalNote: "Nota cultural",
    vocabulary: "Vocabulário",
    examples: "Exemplos",
    spotlight: "Palavra em destaque",
    abbreviations: "Abreviações",
    textImage: "Um olhar mais de perto",
    gallery: "Olha só",
    exerciseTime: "Hora dos exercícios",
    fillBlank: "Complete as frases",
    fillBlankInstructions: "Use as palavras abaixo.",
    dialogue: "Diálogo",
    thanks: "Obrigado(a)!",
    closingMessage: "Até a próxima sessão.",
    words: "Palavras",
    answers: "Respostas",
    answerKey: "Gabarito",
    cont: "cont.",
    topic: "Tema",
    translation: "Tradução",
  },
  fr: {
    objectives: "Objectifs du cours",
    introduction: "Introduction",
    culturalNote: "Note culturelle",
    vocabulary: "Vocabulaire",
    examples: "Exemples",
    spotlight: "Mot à la une",
    abbreviations: "Abréviations",
    textImage: "De plus près",
    gallery: "Regardez",
    exerciseTime: "C'est l'heure des exercices",
    fillBlank: "Complétez les phrases",
    fillBlankInstructions: "Utilisez les mots ci-dessous.",
    dialogue: "Dialogue",
    thanks: "Merci !",
    closingMessage: "À la prochaine session.",
    words: "Mots",
    answers: "Réponses",
    answerKey: "Corrigé",
    cont: "suite",
    topic: "Thème",
    translation: "Traduction",
  },
  de: {
    objectives: "Lernziele",
    introduction: "Einführung",
    culturalNote: "Kultureller Hinweis",
    vocabulary: "Wortschatz",
    examples: "Beispiele",
    spotlight: "Wort im Fokus",
    abbreviations: "Abkürzungen",
    textImage: "Genauer hingeschaut",
    gallery: "Schau mal",
    exerciseTime: "Zeit für Übungen",
    fillBlank: "Ergänze die Sätze",
    fillBlankInstructions: "Benutze die Wörter unten.",
    dialogue: "Dialog",
    thanks: "Danke!",
    closingMessage: "Bis zur nächsten Session.",
    words: "Wörter",
    answers: "Antworten",
    answerKey: "Lösungen",
    cont: "Forts.",
    topic: "Thema",
    translation: "Übersetzung",
  },
  it: {
    objectives: "Obiettivi della lezione",
    introduction: "Introduzione",
    culturalNote: "Nota culturale",
    vocabulary: "Vocabolario",
    examples: "Esempi",
    spotlight: "Parola in evidenza",
    abbreviations: "Abbreviazioni",
    textImage: "Uno sguardo più da vicino",
    gallery: "Guarda qui",
    exerciseTime: "Ora degli esercizi",
    fillBlank: "Completa le frasi",
    fillBlankInstructions: "Usa le parole qui sotto.",
    dialogue: "Dialogo",
    thanks: "Grazie!",
    closingMessage: "Alla prossima sessione.",
    words: "Parole",
    answers: "Risposte",
    answerKey: "Soluzioni",
    cont: "cont.",
    topic: "Tema",
    translation: "Traduzione",
  },
}

/** "pt-BR" → "pt". Phrases are written per base language. */
function base(tag: string) {
  return tag.split("-")[0].toLowerCase()
}

export function phrase(tag: string, key: Phrase): string {
  return TABLE[base(tag)]?.[key] ?? ""
}

export function phraseFor(languages: string[], key: Phrase): Localized {
  return Object.fromEntries(languages.map((tag) => [tag, phrase(tag, key)]))
}

/** Template labels fall back to English so a slide never prints an empty label. */
export function label(tag: string, key: Phrase): string {
  return phrase(tag, key) || TABLE.en[key]
}
