import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const resolvers = {
  Query: {
    guests: () => prisma.guest.findMany(),
  },
  Mutation: {
    createGuestMutation: async (_, { firstName, lastName }) => {
      return prisma.guest.create({
        data: {
          firstName,
          lastName,
          attending: true,
        },
      });
    },
    updateGuestMutation: async (_, { id, attending }) => {
      return prisma.guest.update({
        where: { id },
        data: {
          attending,
        },
      });
    },
    deleteGuestMutation: async (_, { id }) => {
      return prisma.guest.delete({
        where: { id },
      });
    },
  },
};

export default resolvers;
