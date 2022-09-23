import { createContext } from 'react';
// eslint-disable-next-line import/no-cycle
import { SearchSourceFormData } from '../hooks';

export interface SearchContextValue {
  allExpanded: boolean;
  toggleAllExpanded: () => void;
  searchValue?: SearchSourceFormData | null;
  // eslint-disable-next-line no-unused-vars
  setSearchValue: (searchValue: SearchSourceFormData | null) => void;
}

const searchContext = createContext<SearchContextValue | null>(null);

export default searchContext;
