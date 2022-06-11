import { createContext } from 'react';
import { SourceWithRelations } from '../../db';

export interface EditingSourceContext {
  sourceToEdit?: SourceWithRelations;
  // eslint-disable-next-line no-unused-vars
  setSourceToEdit: (source: SourceWithRelations) => void;
}

const EditingSource = createContext<EditingSourceContext | null>(null);

export default EditingSource;
