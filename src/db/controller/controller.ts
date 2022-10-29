import {
  Author,
  Tag,
  Region,
} from '@prisma/client';
import { createRelatableController } from './relatables';
import { sourceController } from './sources';
import { userController } from './users';

export namespace Controller {
  export const sources = sourceController();
  export const users = userController();
  export const tags = createRelatableController<Tag>('tag', 'tagIds');
  export const authors = createRelatableController<Author>('author', 'authorIds');
  export const regions = createRelatableController<Region>('region', 'regionIds');
}
