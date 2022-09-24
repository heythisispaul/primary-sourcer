import { Source } from '@prisma/client';
import client from '../client';
import {
  CreateInput,
  SourceSearchParameters,
  SortKey,
  SourceWithRelations,
} from '../types';
import { PAGE_TAKE } from '../../utils';

const getClause = (isInclusive: boolean) => (isInclusive
  ? 'hasEvery'
  : 'hasSome');

export const sourceController = () => ({
  async create(data: CreateInput<Source>) {
    const newSource = await client.source.create({ data });
    return newSource;
  },

  async delete(sourceId: string) {
    const deletedSource = await client.source.delete({ where: { id: sourceId } });
    return deletedSource;
  },

  async get(id: string) {
    const source = client.source.findUnique({ where: { id } });
    return source;
  },

  async update(id: string, data: Source) {
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
  },

  async getPage(
    {
      offset = 0,
      title = '',
      tagIds = [],
      tagsInclusive,
      authorIds = [],
      authorsInclusive,
      regionIds = [],
      regionsInclusive,
      sortKey = SortKey.CREATED,
      yearStart,
      yearEnd,
      meOnly,
    }: SourceSearchParameters,
    currentUser?: string,
  ) {
    console.log(currentUser);
    console.log(meOnly);
    const tagFilter = tagIds.length ? {
      tagIds: { [getClause(tagsInclusive)]: tagIds },
    } : {};
    const authorFilter = authorIds.length ? {
      authorIds: { [getClause(authorsInclusive)]: authorIds },
    } : {};
    const regionsFilter = regionIds.length ? {
      regionIds: { [getClause(regionsInclusive)]: regionIds },
    } : {};
    const createdByFilter = meOnly && currentUser ? {
      createdById: currentUser,
    } : {};

    const searchResults = await client.source.findMany({
      take: PAGE_TAKE,
      skip: PAGE_TAKE * offset,
      where: {
        title: { contains: title, mode: 'insensitive' },
        ...tagFilter,
        ...authorFilter,
        ...regionsFilter,
        ...(yearStart ? { yearStart: { gte: yearStart } } : {}),
        ...(yearEnd ? { yearEnd: { lte: yearEnd } } : {}),
        ...createdByFilter,
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
        createdBy: {
          select: {
            username: true,
            id: true,
          },
        },
      },
      orderBy: {
        [sortKey]: 'desc',
      },
    });

    return searchResults as unknown as SourceWithRelations[];
  },
});
