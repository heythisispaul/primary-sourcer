import {
  Source,
  Author,
  Tag,
  Region,
} from '@prisma/client';
import client from './client';
import {
  CreateInput,
  SourceSearchParameters,
  SortKey,
  SourceWithRelations,
  RelatableInput,
} from './types';

type RelatableCollection = 'tag' | 'region' | 'author';

const createRelatable = <T>(model: RelatableCollection) => async (data: RelatableInput) => {
  // @ts-ignore
  const created = await client[model].create({ data }) as T;
  return created;
};

const addRelatableToSource = (idsType: keyof Source) => async (
  sourceId: string,
  relatableId: string,
) => {
  const updatedSource = await client.source.update({
    where: { id: sourceId },
    data: {
      [idsType]: {
        push: relatableId,
      },
    },
  });

  return updatedSource;
};

// There is no remove from list function in Prisma :(
const removeRelatableFromSource = (idsType: keyof Source) => async (
  sourceId: string,
  relatableIds: string | string[],
) => {
  const relatablestoRemove = [relatableIds].flat();
  const sourceToUpdate = await client.source.findUnique({ where: { id: sourceId } });
  const sourceList = sourceToUpdate && sourceToUpdate[idsType];
  if (sourceList) {
    const updatedTagsList = (sourceList as string[])
      .filter((tag) => !relatablestoRemove.includes(tag));

    const updatedSource = await client.source.update({
      where: { id: sourceId },
      data: {
        tagIds: {
          set: updatedTagsList,
        },
      },
    });

    return updatedSource;
  }

  return sourceToUpdate;
};

export const getRelatableOptions = <T>(model: RelatableCollection) => async (
  searchTerm: string,
  limit = 10,
) => {
  const relatables = await client[model].findMany({
    take: limit,
    where: {
      name: { contains: searchTerm, mode: 'insensitive' },
    },
    select: {
      name: true,
      id: true,
      createdAt: true,
    },
  });

  // @ts-ignore
  return relatables as T[];
};

export namespace Controller {
  // SOURCES
  export async function createSource(data: CreateInput<Source>) {
    const newSource = await client.source.create({ data });
    return newSource;
  }

  export async function deleteSource(sourceId: string) {
    const deletedSource = await client.source.delete({ where: { id: sourceId } });
    return deletedSource;
  }

  export async function getSource(id: string) {
    const source = client.source.findUnique({ where: { id } });
    return source;
  }

  export async function updateSource(id: string, data: Source) {
    const updatedSource = await client.source.update({
      where: { id },
      data: {
        description: data.description,
        tagIds: data.tagIds,
        authorIds: data.authorIds,
        regionIds: data.regionIds,
        title: data.title,
        href: data.href,
        yearType: data.yearType,
        yearStart: data.yearStart,
        yearEnd: data.yearEnd,
      },
    });
    return updatedSource;
  }

  export async function getPageOfSources({
    offset = 0,
    searchTerm = '',
    tags = [],
    authors = [],
    sortKey = SortKey.CREATED,
  }: SourceSearchParameters) {
    const tagFilter = tags.length ? { tagIds: { hasSome: tags } } : {};
    const authorFilter = authors.length ? { authorIds: { hasSome: authors } } : {};
    const TAKE = 25;
    const searchResults = await client.source.findMany({
      take: TAKE,
      skip: TAKE * offset,
      where: {
        title: { contains: searchTerm },
        ...tagFilter,
        ...authorFilter,
      },
      include: {
        authors: {
          select: {
            name: true,
            id: true,
          },
        },
        tags: {
          select: {
            name: true,
            id: true,
          },
        },
        regions: {
          select: {
            name: true,
            id: true,
          },
        },
      },
      orderBy: {
        [sortKey]: 'desc',
      },
    });

    return searchResults as unknown as SourceWithRelations[];
  }

  // TAGS
  export const createTag = createRelatable<Tag>('tag');
  export const getTagOptions = getRelatableOptions<Tag>('tag');
  export const addTagToSource = addRelatableToSource('tagIds');
  export const removeTagFromSource = removeRelatableFromSource('tagIds');

  // AUTHORS
  export const createAuthor = createRelatable<Author>('author');
  export const getAuthorOptions = getRelatableOptions<Author>('author');
  export const addAuthorToSource = addRelatableToSource('authorIds');
  export const removeAuthorsFromSource = removeRelatableFromSource('authorIds');

  // REGIONS
  export const createRegion = createRelatable<Region>('region');
  export const getRegionOptions = getRelatableOptions<Region>('region');
  export const addRegionToSource = addRelatableToSource('regionIds');
  export const removeRegionsFromSource = removeRelatableFromSource('regionIds');
}
