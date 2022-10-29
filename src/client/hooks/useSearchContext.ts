import { useContext } from 'react';
import SearchContext, { SearchContextValue } from '../contexts/searchContext';

export const useSearchContext = () => {
  const context = useContext(SearchContext);
  return context as SearchContextValue;
};
