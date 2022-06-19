import { User } from '@prisma/client';
import client from '../client';

export const userController = () => ({
  async create(userInput: Pick<User, 'externalId' | 'username'>) {
    const newUser = await client.user.create({ data: userInput });
    return newUser;
  },

  // TODO: Make this a little safer instead of spreading in all attributes
  async update(id: string, updateData: Partial<User>) {
    const updatedUser = await client.user.update({
      where: { id },
      data: updateData,
    });

    return updatedUser;
  },

  async get(id: string) {
    const user = await client.user.findUnique({ where: { id } });
    return user;
  },

  async getByExternalId(externalId: string) {
    const user = await client.user.findFirst({
      where: { externalId },
    });
    return user;
  },
});
