/* eslint-disable no-unused-vars */
import {
  Tag,
  Author,
  Source,
  Region,
  User,
} from '@prisma/client';

export type CreateInput<T> = Omit<T, 'createdAt' | 'id'>;

export type RelatableInput = {
  name: string;
  sourceIds: string[];
}

// eslint-disable-next-line no-shadow
export enum SortKey {
  CREATED = 'createdAt',
  AGE_START = 'ageStart',
  AGE_END = 'ageEnd',
}

export interface SourceSearchParameters {
  offset?: number;
  title?: string;
  tagIds?: Tag['id'][];
  tagsInclusive: boolean;
  authorIds?: Author['id'][];
  authorsInclusive: boolean;
  regionIds?: Region['id'][];
  regionsInclusive: boolean;
  yearType?: Source['yearType'];
  yearStart?: number;
  yearEnd?: number;
  sortKey?: SortKey;
}

export type SourceWithRelations = Source & {
  tags: Pick<Tag, 'id' | 'name'>[],
  authors: Pick<Author, 'id' | 'name'>[]
  regions: Pick<Region, 'id' | 'name'>[]
  createdBy: Pick<User, 'id' | 'username'>
};
