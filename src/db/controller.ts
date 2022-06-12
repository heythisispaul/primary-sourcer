import { Source, Author, Tag } from '@prisma/client';
import client from './client';
import {
  CreateInput,
  SourceSearchParameters,
  SortKey,
  SourceWithRelations,
} from './types';

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
        title: data.title,
        href: data.href,
        yearType: data.yearType,
        yearStart: data.yearStart,
        yearEnd: data.yearEnd,
      },
    });
    return updatedSource;
  }

  export async function createTag(data: CreateInput<Tag>) {
    const newTag = await client.tag.create({ data });
    return newTag;
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
      },
      orderBy: {
        [sortKey]: 'desc',
      },
    });

    return searchResults as unknown as SourceWithRelations[];
  }

  // AUTHORS
  export async function createAuthor(data: CreateInput<Author>) {
    const newAuthor = await client.author.create({ data });
    return newAuthor;
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

  export async function getTagOptions(searchTerm: string, limit = 10) {
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

  // TAGS
  export async function addTagToSource(sourceId: string, tagId: string) {
    const updatedSource = await client.source.update({
      where: { id: sourceId },
      data: {
        tagIds: {
          push: tagId,
        },
      },
    });

    return updatedSource;
  }

  // There is no remove from list function in Prisma :(
  export async function removeTagsFromSource(sourceId: string, tagIds: string | string[]) {
    const tagsToRemove = [tagIds].flat();
    const sourceToUpdate = await client.source.findUnique({ where: { id: sourceId } });
    const updatedTagsList = sourceToUpdate?.tagIds.filter((tag) => !tagsToRemove.includes(tag));
    if (updatedTagsList) {
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
  }

  // TODO: Consolidate a lot of the similar methods in here
  export async function getAuthorOptions(searchTerm: string, limit = 10) {
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
}
