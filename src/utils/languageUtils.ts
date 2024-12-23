export const SUPPORTED_LANGUAGES = {
  'es': 'es-ES',
  'en': 'en-US',
  'fr': 'fr-FR',
  'de': 'de-DE',
  'it': 'it-IT'
} as const;

export type SupportedLanguage = keyof typeof SUPPORTED_LANGUAGES;

export function getLanguageCode(language: SupportedLanguage): string {
  return SUPPORTED_LANGUAGES[language] || 'es-ES';
}