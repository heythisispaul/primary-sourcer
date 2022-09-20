import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Validators } from '../../validation';
import { SourceWithRelations } from '../../db';
import { useRelatableControls } from './useRelatableControls';
import { CreateSourceFormData, SearchSourceFormData } from './types';

export const useSourceFormControls = (
  sourceToEdit?: SourceWithRelations & SearchSourceFormData,
) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState,
  } = useForm<CreateSourceFormData & SearchSourceFormData>({
    resolver: yupResolver(Validators.sourceCreate),
    defaultValues: {
      ...sourceToEdit,
      description: sourceToEdit?.description ?? '',
      yearStart: sourceToEdit?.yearStart ?? undefined,
      yearEnd: sourceToEdit?.yearEnd ?? undefined,
    },
  });

  const relatableControls = useRelatableControls(setValue, sourceToEdit);

  return {
    ...relatableControls,
    register,
    handleSubmit,
    watch,
    setValue,
    formState,
  } as const;
};
