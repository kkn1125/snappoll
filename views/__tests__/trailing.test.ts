import { ensureTrailingSlash } from '@utils/ensureTrailingSlash';
import { describe, expect, it } from 'vitest';

describe('Path Trailing Test', () => {
  it('Ensure Trailing Slash', () => {
    const path = '/';
    const normalizedPath = ensureTrailingSlash(path);
    expect(normalizedPath).toStrictEqual('/');
  });

  it('A Long path trailing Test', () => {
    const path = '/test';
    const normalizedPath = ensureTrailingSlash(path);
    expect(normalizedPath).toStrictEqual('/test/');
  });

  it('A Long path and qurey Param trailing Test', () => {
    const path = '/test?id=pass&name=devkimson';
    const normalizedPath = ensureTrailingSlash(path);
    expect(normalizedPath).toStrictEqual('/test/?id=pass&name=devkimson');
  });

  it('A Long path and Hash trailing Test', () => {
    const path = '/test?id=pass&name=devkimson#tetw';
    const normalizedPath = ensureTrailingSlash(path);
    expect(normalizedPath).toStrictEqual('/test/?id=pass&name=devkimson#tetw');
  });
});
