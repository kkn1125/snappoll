export const ensureTrailingSlash = (path: string) => {
  const [pathname, search, hashed] = path.split(/\?|#/);
  const endOfSlash = pathname.endsWith('/');
  const withSlash = pathname + '/';
  const trailingPath = endOfSlash ? pathname : withSlash;
  let result = trailingPath;
  if (search) {
    const searchParam = new URLSearchParams(search);
    result = [result, searchParam].join('?');
  }
  if (hashed) {
    result = [result, hashed].join('#');
  }
  return result;
};
