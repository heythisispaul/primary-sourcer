import { createContext } from 'react';

export interface SearchContextValue {
  allExpanded: boolean;
  toggleAllExpanded: () => void;
}

const searchContext = createContext<SearchContextValue | null>(null);

export default searchContext;
