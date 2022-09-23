import { Source } from '@prisma/client';

export interface Relatable {
  id: string;
  name: string;
}

export type SourceFormData = {
  title: string;
  tags: Relatable[];
  authors: Relatable[];
  regions: Relatable[];
  yearType: Source['yearType'];
  yearStart?: number | null;
  yearEnd?: number | null;
}

export type CreateSourceFormData = SourceFormData & {
  href: string;
  description?: string;
  tagIds: string[];
  authorIds: string[];
  regionIds: string[];
}

export type SearchSourceFormData = Omit<CreateSourceFormData, 'description' | 'href' | 'yearType'> & {
  tagsInclusive?: boolean;
  authorsInclusive?: boolean;
  regionsInclusive?: boolean;
  meOnly?: boolean;
}
