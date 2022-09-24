import { SearchSourceFormData } from './hooks';

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

export const getThisYear = () => {
  const today = new Date();
  return today.getFullYear();
};

export const thisYear = getThisYear();

export const getQueryString = () => {
  if (typeof window !== 'undefined') {
    const queryString = window.location.href?.split('?')[1] ?? '';
    const parsed = new URLSearchParams(queryString);
    return parsed;
  }

  return new URLSearchParams();
};

export const DEFAULT_SEARCH_DATA: SearchSourceFormData = {
  authorsInclusive: true,
  tagsInclusive: true,
  regionsInclusive: true,
  meOnly: false,
  title: '',
  tagIds: [],
  tags: [],
  authorIds: [],
  authors: [],
  regionIds: [],
  regions: [],
  offset: 0,
};
