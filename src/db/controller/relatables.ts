import { Source } from '@prisma/client';
import client from '../client';
import { RelatableInput } from '../types';

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

export const createRelatableController = <T>(
  collecton: RelatableCollection,
  idsKey: keyof Source,
) => ({
    create: createRelatable<T>(collecton),
    getOptions: getRelatableOptions<T>(collecton),
    addToSource: addRelatableToSource(idsKey),
    removeFromSource: removeRelatableFromSource(idsKey),
  });
