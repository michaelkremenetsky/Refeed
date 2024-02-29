import dayjs from "dayjs";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

// Tip - use the VSCode Outline View feature to see the APIs defined in here without having to scroll through the file

export const bookmarkRouter = createTRPCRouter({
  addBookmarkFolderToItem: protectedProcedure
    .input(
      z.object({
        folderName: z.string(),
        itemId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Add a new bookmark folder with an item or add an item to an existing one.
      let bookmarkFolders;

      // Check if the bookmark folder exists already
      bookmarkFolders = await ctx.prisma.bookmark_folder.findFirst({
        where: {
          name: input.folderName,
          user_id: ctx.user.id,
        },
        select: {
          name: true,
          id: true,
        },
      });

      // If the bookmark folder dosen't exist create it
      if (!bookmarkFolders) {
        bookmarkFolders = await ctx.prisma.bookmark_folder.create({
          data: {
            name: input.folderName,
            user_id: ctx.user.id,
            items: {
              create: {
                item_id: input.itemId,
                user_id: ctx.user.id,
              },
            },
          },
        });
      }

      // Check if the user_item exists, if it dosen't create it
      await ctx.prisma.user_item.upsert({
        where: {
          item_id_user_id: {
            item_id: input.itemId,
            user_id: ctx.user.id,
          },
        },
        create: {
          item_id: input.itemId,
          user_id: ctx.user.id,
          marked_read: true,
          bookmark_folders: {
            connectOrCreate: {
              where: {
                folder_id_item_id_user_id: {
                  folder_id: bookmarkFolders.id,
                  item_id: input.itemId,
                  user_id: ctx.user.id,
                },
              },
              create: {
                folder_id: bookmarkFolders.id,
              },
            },
          },
        },
        update: {
          bookmark_folders: {
            connectOrCreate: {
              where: {
                folder_id_item_id_user_id: {
                  folder_id: bookmarkFolders.id,
                  item_id: input.itemId,
                  user_id: ctx.user.id,
                },
              },
              create: {
                folder_id: bookmarkFolders.id,
              },
            },
          },
        },
      });
    }),
  removeBookmarkFolderFromItem: protectedProcedure
    .input(z.object({ folderName: z.string(), itemId: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      // Remove a bookmark folder or remove an item from a bookmark folder if you include an itemId.
      const bookmarkFolder = await ctx.prisma.bookmark_folder.findFirst({
        where: {
          name: input.folderName,
          user_id: ctx.user.id,
        },
        select: {
          id: true,
        },
      });

      if (input.itemId) {
        if (!bookmarkFolder) {
          return;
        }

        await ctx.prisma.user_item.update({
          where: {
            item_id_user_id: {
              item_id: input.itemId,
              user_id: ctx.user.id,
            },
          },
          data: {
            bookmark_folders: {
              delete: {
                folder_id_item_id_user_id: {
                  folder_id: bookmarkFolder.id,
                  item_id: input.itemId,
                  user_id: ctx.user.id,
                },
              },
            },
          },
        });
        return;
      }

      await ctx.prisma.bookmark_folder.delete({
        where: {
          name_user_id: {
            name: input.folderName,
            user_id: ctx.user.id,
          },
        },
      });
    }),
  deleteBookmarkFolder: protectedProcedure
    .input(z.object({ folderName: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const bookmarkFolder = await ctx.prisma.bookmark_folder.findFirst({
        where: {
          name: input.folderName,
          user_id: ctx.user.id,
        },
        select: {
          id: true,
        },
      });

      if (!bookmarkFolder) {
        return;
      }

      await ctx.prisma.bookmark_folder_items.deleteMany({
        where: {
          folder_id: bookmarkFolder.id,
        },
      });

      await ctx.prisma.bookmark_folder.delete({
        where: {
          name_user_id: {
            name: input.folderName,
            user_id: ctx.user.id,
          },
        },
      });
    }),

  getBookmarkFoldersForUser: protectedProcedure.query(async ({ ctx }) => {
    // Get all the bookmark folders for a user and the number of bookmarks in each folder.

    const query = await ctx.prisma.bookmark_folder.findMany({
      where: {
        user_id: ctx.user.id,
      },
      select: {
        name: true,
        _count: {
          select: {
            items: true,
          },
        },
      },
    });

    // convert _count to amount
    const BookmarkFolders = query.map((item) => {
      return {
        name: item.name,
        amount: item._count.items,
      };
    });

    return BookmarkFolders;
  }),
  checkTempBookmarks: protectedProcedure.mutation(async ({ ctx }) => {
    // Check if there are any temp bookmarks and remove them if there are any

    const query = await ctx.prisma.user_item.findMany({
      where: {
        temp_added_time: {
          lte: dayjs().toDate(),
        },
        user_id: ctx.user.id,
      },
    });

    // Remove the temp bookmarks
    if (query.length > 0) {
      await ctx.prisma.user_item.updateMany({
        where: {
          temp_added_time: {
            lte: dayjs().toDate(),
          },
          user_id: ctx.user.id,
        },
        data: {
          in_read_later: false,
          temp_added_time: null,
        },
      });
    }
  }),
});
