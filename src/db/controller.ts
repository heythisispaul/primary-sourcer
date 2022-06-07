import { Source, Author, Tag } from '@prisma/client';
import client from './client';
import { CreateInput, SourceSearchParameters, SortKey } from './types';

export namespace Controller {
  export async function createSource(data: CreateInput<Source>) {
    const newSource = await client.source.create({ data });
    return newSource;
  }

  export async function deleteSource(sourceId: string) {
    const deletedSource = await client.source.delete({ where: { id: sourceId } });
    return deletedSource;
  }

  export async function createTag(data: CreateInput<Tag>) {
    const newTag = await client.tag.create({ data });
    return newTag;
  }

  export async function createAuthor(data: CreateInput<Author>) {
    const newAuthor = await client.author.create({ data });
    return newAuthor;
  }

  export async function addTagToSource(sourceId: string, tagId: string) {
    const updatedSource = await client.source.update({
      where: { id: sourceId },
      data: {
        TagIds: {
          push: tagId,
        },
      },
    });

    return updatedSource;
  }

  export async function addAuthorToSource(sourceId: string, authorId: string) {
    const updatedSource = await client.source.update({
      where: { id: sourceId },
      data: {
        authorIds: {
          push: authorId,
        },
      },
    });

    return updatedSource;
  }

  // There is no remove from list function in Prisma :(
  export async function removeTagsFromSource(sourceId: string, tagIds: string | string[]) {
    const tagsToRemove = [tagIds].flat();
    const sourceToUpdate = await client.source.findUnique({ where: { id: sourceId } });
    const updatedTagsList = sourceToUpdate?.TagIds.filter((tag) => !tagsToRemove.includes(tag));
    if (updatedTagsList) {
      const updatedSource = await client.source.update({
        where: { id: sourceId },
        data: {
          TagIds: {
            set: updatedTagsList,
          },
        },
      });

      return updatedSource;
    }

    return sourceToUpdate;
  }

  export async function removeAuthorsFromSource(sourceId: string, authorIds: string | string[]) {
    const authorsToRemove = [authorIds].flat();
    const sourceToUpdate = await client.source.findUnique({ where: { id: sourceId } });
    const updateAuthorList = sourceToUpdate?.authorIds
      .filter((author) => !authorsToRemove.includes(author));

    if (updateAuthorList) {
      const updatedSource = await client.source.update({
        where: { id: sourceId },
        data: {
          authorIds: {
            set: updateAuthorList,
          },
        },
      });

      return updatedSource;
    }

    return sourceToUpdate;
  }

  export async function getPageOfSources({
    offset = 0,
    searchTerm = '',
    tags = [],
    authors = [],
    sortKey = SortKey.CREATED,
  }: SourceSearchParameters) {
    const TAKE = 25;
    const searchResults = await client.source.findMany({
      take: TAKE,
      skip: TAKE * offset,
      where: {
        title: { contains: searchTerm },
        TagIds: { hasSome: tags },
        authorIds: { hasSome: authors },
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
      },
      orderBy: {
        [sortKey]: 'desc',
      },
    });

    return searchResults;
  }

  // TODO: Consolidate a lot of the similar methods in here
  export async function getAuthorOptions(searchTerm: string, limit = 25) {
    const authors = await client.author.findMany({
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

    return authors;
  }

  export async function getTagOptions(searchTerm: string, limit = 25) {
    const tags = await client.tag.findMany({
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

    return tags;
  }
}
