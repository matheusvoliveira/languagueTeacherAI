const normalizedBaseUrl = (process.env.REACT_APP_API_URL || "").replace(/\/$/, "");

export function apiUrl(pathname = "") {
  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return normalizedBaseUrl ? `${normalizedBaseUrl}${normalizedPath}` : normalizedPath;
}

export const apiBaseUrl = normalizedBaseUrl;
