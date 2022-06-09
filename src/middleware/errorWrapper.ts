import { SourcerNextApiHandler } from './types';

// I have to assume there's a real version of this somewhere?
export type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT';

const errorHandlingMiddleware = (methods: HttpMethod[]) => (
  wrapped: SourcerNextApiHandler,
): SourcerNextApiHandler => async (req, res) => {
  try {
    const isMatchingMethod = methods.includes((req.method as HttpMethod) ?? '');
    if (isMatchingMethod) {
      await wrapped(req, res);
    } else {
      res.status(404);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: true,
    });
  }
};

export default errorHandlingMiddleware;
