import { SourcerNextApiHandler } from './types';

// I have to assume there's a real version of this somewhere?
export type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT';

const errorHandlingMiddleware = (methods: HttpMethod[]) => (
  wrapped: SourcerNextApiHandler,
// eslint-disable-next-line consistent-return
): SourcerNextApiHandler => async (req, res) => {
  try {
    const parsedBody = req.body && typeof req.body === 'string' ? JSON.parse(req.body) : null;
    req.body = parsedBody;
    const isMatchingMethod = methods.includes((req.method as HttpMethod) ?? '');
    if (isMatchingMethod) {
      await wrapped(req, res);
    } else {
      return res.status(404);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: true,
    });
  }
};

export default errorHandlingMiddleware;
