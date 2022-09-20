import { useContext } from 'react';
import EditingSource, { EditingSourceContext } from '../contexts/EditingSource';

export const useEditingSourceControls = () => {
  const context = useContext(EditingSource);
  return context as EditingSourceContext;
};
