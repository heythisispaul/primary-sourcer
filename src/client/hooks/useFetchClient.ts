/* eslint-disable no-unused-vars */
/* eslint-disable arrow-body-style */
/* eslint-disable no-undef */
// I know this *technically* isn't a hook, but I'm preparing for the need
// to read context and such (auth and reCAPTCHA).
export const useFetchClient = <T = unknown, E = unknown>(
  path: string,
  optionBuilder?: (inputData: E) => RequestInit,
) => {
  return async (inputData: E) => {
    const options = optionBuilder ? optionBuilder(inputData) : {};
    const response = await fetch(path, options);
    const data = await response.json() as T;

    if (!response.ok) {
      throw new Error(data as any);
    }

    return data;
  };
};
