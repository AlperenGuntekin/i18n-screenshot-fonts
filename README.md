# i18n-screenshot-fonts — Fonts for Multilingual App Store Screenshots

[![npm version](https://img.shields.io/npm/v/i18n-screenshot-fonts.svg)](https://www.npmjs.com/package/i18n-screenshot-fonts)
[![npm downloads](https://img.shields.io/npm/dm/i18n-screenshot-fonts.svg)](https://www.npmjs.com/package/i18n-screenshot-fonts)
[![license](https://img.shields.io/npm/l/i18n-screenshot-fonts.svg)](./LICENSE)

> Curated font recommendations for multilingual App Store screenshots and UI. 40+ languages, platform-aware (iOS / Android / Web), with proper fallback chains for CJK, Arabic, Hebrew, Thai, and Devanagari scripts.

Built as part of **[Shotlingo](https://shotlingo.com)** — an AI-powered App Store screenshot localization tool.

## Why this exists

"Just use Noto Sans" is a trap. Noto Sans without the JP/KR/SC/TC suffix on Japanese text falls back to Chinese glyphs that look subtly wrong to native readers. SF Pro on Japanese iOS is actually SF Pro JP, a different font file. Android's CJK fonts are `Noto Sans CJK JP`, not `Noto Sans JP`. Arabic on iOS defaults to SF Arabic — on Android it's Noto Naskh Arabic.

This library ships font recommendations that respect these nuances, with a sensible order: **platform-native picks first, then cross-platform fallbacks, then a generic safety net**.

## Install

```bash
npm install i18n-screenshot-fonts
```

## Usage

```ts
import { fontsFor, cssFontStack, requiresScriptFont } from 'i18n-screenshot-fonts';

// Ordered array of fonts for a locale
fontsFor('ja');
// → ['Noto Sans JP', 'Hiragino Sans', 'Yu Gothic', 'SF Pro JP', 'Inter', ...]

fontsFor('ja', 'ios');
// → ['SF Pro JP', 'Hiragino Sans', 'Noto Sans JP', 'Yu Gothic', 'Inter', ...]

fontsFor('ar', 'android');
// → ['Noto Naskh Arabic', 'Noto Sans Arabic', 'SF Arabic', 'Cairo', ...]

// Ready-to-use CSS font-family string
cssFontStack('zh-Hans', 'ios');
// → '"PingFang SC", "Noto Sans SC", "Source Han Sans SC", "Microsoft YaHei", Inter, Roboto, "Noto Sans", "Helvetica Neue", Arial, sans-serif'

// Quick check: does this locale need a specialized font file?
requiresScriptFont('de'); // → false (Latin script, any generic font works)
requiresScriptFont('ja'); // → true  (must include a CJK-capable font)
requiresScriptFont('ar'); // → true  (must include an Arabic-capable font)
```

## Common use cases

### Setting font on a Fabric.js / Konva canvas text node

```ts
import { fontsFor } from 'i18n-screenshot-fonts';

const locale = 'ja';
textNode.set({ fontFamily: fontsFor(locale, 'ios')[0] });
```

### Generating stylesheet rules per locale

```ts
import { cssFontStack } from 'i18n-screenshot-fonts';

for (const locale of ['en', 'ja', 'ko', 'ar', 'he']) {
  console.log(`[lang="${locale}"] { font-family: ${cssFontStack(locale, 'web')}; }`);
}
```

### Deciding when to preload a Google Font

```ts
import { requiresScriptFont, fontsFor } from 'i18n-screenshot-fonts';

if (requiresScriptFont(userLocale)) {
  const primary = fontsFor(userLocale)[0];
  // Preload primary CJK/Arabic/Devanagari font to avoid FOUT on text-heavy screens
  preloadFont(primary);
}
```

## API

### `fontsFor(locale, platform?)`

Returns an ordered, deduplicated `string[]` of recommended fonts.

- `locale` — any identifier understood by `app-store-locales` (ISO code, App Store code, Play Store code, or slug)
- `platform` — optional `'ios' | 'android' | 'web'`. When provided, platform-native fonts are prepended.

Always ends with the generic fallback chain (`Inter, Roboto, Noto Sans, Helvetica Neue, Arial, sans-serif`).

### `cssFontStack(locale, platform?)`

Same as `fontsFor` but returns a single CSS-ready string with multi-word font names properly quoted.

### `requiresScriptFont(locale)`

Returns `true` for languages that need a specialized font file (CJK, Arabic, Hebrew, Persian, Urdu, Thai, Hindi, Tamil, Bengali, Greek). Returns `false` for Latin-script languages and unknown locales.

## Related packages

- [**app-store-locales**](https://www.npmjs.com/package/app-store-locales) — the underlying locale dataset (required peer)
- [**text-expansion-calculator**](https://www.npmjs.com/package/text-expansion-calculator) — companion package for layout overflow estimation
- [**Shotlingo**](https://shotlingo.com) — the product this package comes from. Localize your App Store screenshots to 40+ languages with AI.

## Related tools

- [RTL screenshot preview](https://shotlingo.com/tools/rtl-screenshot-preview) — preview Arabic/Hebrew screenshot layouts before you localize
- [App Store locale codes reference](https://shotlingo.com/tools/app-store-locale-codes) — every supported App Store & Play Store locale code
- [App Store localization checker](https://shotlingo.com/tools/app-store-localization-checker) — per-language text expansion and script requirements for all 41 App Store languages

## Contributing

Spotted a better font pick for your market, or a wrong platform-native mapping? [Open an issue](https://github.com/AlperenGuntekin/i18n-screenshot-fonts/issues) or send a PR — especially if you're a native speaker of a language currently using a fallback.

## License

MIT © [Alperen Güntekin](https://shotlingo.com)

---

<sub>Built by [App Store localization checker](https://shotlingo.com) for multilingual App Store screenshots, Shotlingo.</sub>
