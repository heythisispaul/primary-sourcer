export const csvToArray = (value?: string) => (value
  ? value.split(',')
  : []);

export const toNumber = (value?: string) => (value
  ? parseInt(value, 10)
  : undefined);

export const omit = <T>(object: Record<string, any>, ...omissions: string[]) => {
  const objectCopy = { ...object };
  omissions.forEach((key) => {
    delete objectCopy[key];
  });

  return objectCopy as T;
};

export const parseBase64ToObject = (base64Encoded: string | null) => {
  if (!base64Encoded || base64Encoded === 'undefined') {
    return null;
  }
  try {
    const buffer = Buffer.from(base64Encoded, 'base64');
    return JSON.parse(buffer.toString('utf-8'));
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const PAGE_TAKE = 25;
