/**
 * Languages a lesson can teach or gloss into. Codes are BCP 47 so they can go straight into
 * `lang` attributes (screen readers and font fallback both key off them).
 * `code` is what the stamp shows — a language code, never a flag (DS §1.1, research §2.2 #8).
 */
export type Language = {
  tag: string
  name: string
  endonym: string
  code: string
  rtl?: boolean
}

export const LANGUAGES: Language[] = [
  { tag: "en", name: "English", endonym: "English", code: "EN" },
  { tag: "es", name: "Spanish", endonym: "Español", code: "ES" },
  { tag: "pt-BR", name: "Portuguese (Brazil)", endonym: "Português (Brasil)", code: "PT-BR" },
  { tag: "pt-PT", name: "Portuguese (Portugal)", endonym: "Português (Portugal)", code: "PT-PT" },
  { tag: "fr", name: "French", endonym: "Français", code: "FR" },
  { tag: "de", name: "German", endonym: "Deutsch", code: "DE" },
  { tag: "it", name: "Italian", endonym: "Italiano", code: "IT" },
  { tag: "nl", name: "Dutch", endonym: "Nederlands", code: "NL" },
  { tag: "ja", name: "Japanese", endonym: "日本語", code: "JA" },
  { tag: "ko", name: "Korean", endonym: "한국어", code: "KO" },
  { tag: "zh-Hans", name: "Chinese (Simplified)", endonym: "简体中文", code: "ZH" },
  { tag: "ar", name: "Arabic", endonym: "العربية", code: "AR", rtl: true },
  { tag: "he", name: "Hebrew", endonym: "עברית", code: "HE", rtl: true },
  { tag: "fa", name: "Persian", endonym: "فارسی", code: "FA", rtl: true },
  { tag: "ru", name: "Russian", endonym: "Русский", code: "RU" },
  { tag: "uk", name: "Ukrainian", endonym: "Українська", code: "UK" },
  { tag: "pl", name: "Polish", endonym: "Polski", code: "PL" },
  { tag: "tr", name: "Turkish", endonym: "Türkçe", code: "TR" },
  { tag: "el", name: "Greek", endonym: "Ελληνικά", code: "EL" },
  { tag: "hi", name: "Hindi", endonym: "हिन्दी", code: "HI" },
  { tag: "id", name: "Indonesian", endonym: "Bahasa Indonesia", code: "ID" },
  { tag: "vi", name: "Vietnamese", endonym: "Tiếng Việt", code: "VI" },
  { tag: "th", name: "Thai", endonym: "ไทย", code: "TH" },
  { tag: "sv", name: "Swedish", endonym: "Svenska", code: "SV" },
]

const byTag = new Map(LANGUAGES.map((l) => [l.tag, l]))

export function getLanguage(tag: string): Language {
  return byTag.get(tag) ?? { tag, name: tag, endonym: tag, code: tag.toUpperCase() }
}

export function dirOf(tag: string): "rtl" | "ltr" {
  return getLanguage(tag).rtl ? "rtl" : "ltr"
}

export const LEVELS = [
  "A1",
  "A1–A2",
  "A2",
  "A2–B1",
  "B1",
  "B1–B2",
  "B2",
  "C1",
  "C2",
  "All levels",
] as const
