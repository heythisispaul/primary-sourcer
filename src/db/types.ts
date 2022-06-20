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
}

export interface SourceSearchParameters {
  offset?: number;
  searchTerm?: string;
  tags?: Tag['id'][];
  authors?: Author['id'][];
  sortKey?: SortKey;
}

export type SourceWithRelations = Source & {
  tags: Pick<Tag, 'id' | 'name'>[],
  authors: Pick<Author, 'id' | 'name'>[]
  regions: Pick<Region, 'id' | 'name'>[]
  createdBy: Pick<User, 'id' | 'username'>
};
