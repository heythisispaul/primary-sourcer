const dateFormatter = new Intl.DateTimeFormat('en-us');
const SAFE_HOSTS = [
  'www.wikipedia.org',
  'www.google.com',
];

export const safelyParseJson = <T>(data: string, fallback?: T) => {
  try {
    const result = JSON.parse(data) as T;
    return result;
  } catch (error: unknown) {
    console.log('Unable to parse SSR props');
    return fallback ?? null;
  }
};

export const toUSDate = (date: Date) => dateFormatter.format(new Date(date));

export const toURL = (urlString: string) => {
  const { href, host } = new URL(urlString);
  const isSafe = SAFE_HOSTS.includes(host);
  return { href, host, isSafe };
};
