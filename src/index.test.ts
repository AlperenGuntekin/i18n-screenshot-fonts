import { describe, it, expect } from 'vitest';
import { fontsFor, cssFontStack, requiresScriptFont } from './index.js';

describe('fontsFor', () => {
  it('returns base locale fonts + generic fallback', () => {
    const fonts = fontsFor('ja');
    expect(fonts[0]).toBe('Noto Sans JP');
    expect(fonts).toContain('sans-serif');
  });

  it('prepends iOS-specific picks when platform is ios', () => {
    const fonts = fontsFor('ja', 'ios');
    expect(fonts[0]).toBe('SF Pro JP');
  });

  it('prepends Android-specific picks when platform is android', () => {
    const fonts = fontsFor('zh-Hans', 'android');
    expect(fonts[0]).toBe('Noto Sans CJK SC');
  });

  it('deduplicates across platform + base + generic', () => {
    const fonts = fontsFor('de');
    const set = new Set(fonts);
    expect(set.size).toBe(fonts.length);
  });

  it('returns generic fallback for unknown locales', () => {
    const fonts = fontsFor('xx');
    expect(fonts).toContain('Inter');
    expect(fonts).toContain('sans-serif');
  });

  it('always ends in sans-serif', () => {
    expect(fontsFor('ja').at(-1)).toBe('sans-serif');
    expect(fontsFor('ar', 'ios').at(-1)).toBe('sans-serif');
  });
});

describe('cssFontStack', () => {
  it('produces a valid CSS font-family value', () => {
    const css = cssFontStack('ja', 'ios');
    expect(css).toContain('"SF Pro JP"');
    expect(css).toContain('sans-serif');
    expect(css).not.toContain('"sans-serif"'); // generic family unquoted
  });

  it('quotes multi-word font names', () => {
    expect(cssFontStack('ar', 'ios')).toContain('"SF Arabic"');
  });
});

describe('requiresScriptFont', () => {
  it('is true for CJK, RTL, Indic', () => {
    expect(requiresScriptFont('ja')).toBe(true);
    expect(requiresScriptFont('ar')).toBe(true);
    expect(requiresScriptFont('he')).toBe(true);
    expect(requiresScriptFont('hi')).toBe(true);
    expect(requiresScriptFont('th')).toBe(true);
  });

  it('is false for Latin-script languages', () => {
    expect(requiresScriptFont('de')).toBe(false);
    expect(requiresScriptFont('es')).toBe(false);
    expect(requiresScriptFont('tr')).toBe(false);
  });

  it('is false for unknown locales', () => {
    expect(requiresScriptFont('xx')).toBe(false);
  });
});
