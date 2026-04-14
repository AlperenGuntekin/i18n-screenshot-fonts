import { getLocale, getFonts as getLocaleFonts } from 'app-store-locales';

export type Platform = 'ios' | 'android' | 'web';

/**
 * Platform-specific font overrides layered on top of the
 * language-neutral fallbacks from `app-store-locales`.
 */
const PLATFORM_OVERRIDES: Record<Platform, Record<string, readonly string[]>> = {
  ios: {
    ja: ['SF Pro JP', 'Hiragino Sans'],
    'zh-Hans': ['PingFang SC'],
    'zh-Hant': ['PingFang TC'],
    ko: ['Apple SD Gothic Neo'],
    ar: ['SF Arabic'],
    he: ['SF Hebrew'],
    th: ['SF Thai'],
    hi: ['SF Pro', 'Kohinoor Devanagari'],
  },
  android: {
    ja: ['Noto Sans CJK JP', 'Noto Sans JP'],
    'zh-Hans': ['Noto Sans CJK SC', 'Noto Sans SC'],
    'zh-Hant': ['Noto Sans CJK TC', 'Noto Sans TC'],
    ko: ['Noto Sans CJK KR', 'Noto Sans KR'],
    ar: ['Noto Naskh Arabic', 'Noto Sans Arabic'],
    he: ['Noto Sans Hebrew'],
    th: ['Noto Sans Thai'],
    hi: ['Noto Sans Devanagari'],
  },
  web: {
    // Web defaults already match what app-store-locales suggests.
  },
};

/**
 * Generic fallback chain appended at the end of every locale's
 * recommendation when no better fit exists.
 */
const GENERIC_FALLBACK: readonly string[] = [
  'Inter',
  'Roboto',
  'Noto Sans',
  'Helvetica Neue',
  'Arial',
  'sans-serif',
];

/**
 * Get an ordered font stack for a locale, optionally tailored to a target
 * platform (iOS / Android / Web).
 *
 * @example
 * fontsFor('ja');                // base Noto/Hiragino/Yu Gothic fallback chain
 * fontsFor('ja', 'ios');         // SF Pro JP first, then base fallback
 * fontsFor('ar', 'android');     // Noto Naskh Arabic first
 */
export function fontsFor(locale: string, platform?: Platform): string[] {
  const localeInfo = getLocale(locale);
  const baseFonts = localeInfo ? [...getLocaleFonts(locale)] : [];

  const platformFonts = platform && localeInfo
    ? [...(PLATFORM_OVERRIDES[platform][localeInfo.code] ?? [])]
    : [];

  // Order: platform picks → base picks → generic fallback, deduplicated
  const ordered = [...platformFonts, ...baseFonts, ...GENERIC_FALLBACK];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const f of ordered) {
    if (!seen.has(f)) {
      seen.add(f);
      out.push(f);
    }
  }
  return out;
}

/**
 * Return a CSS `font-family` value string for a locale.
 *
 * @example
 * cssFontStack('ar', 'ios');
 * // → '"SF Arabic", "Noto Sans Arabic", Cairo, "IBM Plex Sans Arabic", Inter, Roboto, "Noto Sans", "Helvetica Neue", Arial, sans-serif'
 */
export function cssFontStack(locale: string, platform?: Platform): string {
  return fontsFor(locale, platform)
    .map((f) => (/\s/.test(f) && f !== 'sans-serif' ? `"${f}"` : f))
    .join(', ');
}

/**
 * Whether a locale requires specialized script fonts (CJK, Arabic,
 * Hebrew, Thai, Devanagari, Tamil, Bengali). Latin-script languages
 * return false since generic fonts like Inter/Roboto work fine.
 */
export function requiresScriptFont(locale: string): boolean {
  const info = getLocale(locale);
  if (!info) return false;
  const scriptCodes = new Set([
    'ja', 'ko', 'zh-Hans', 'zh-Hant',
    'ar', 'he', 'fa', 'ur',
    'th', 'hi', 'ta', 'bn', 'el',
  ]);
  return scriptCodes.has(info.code);
}
