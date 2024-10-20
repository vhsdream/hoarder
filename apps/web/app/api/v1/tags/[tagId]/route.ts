import { NextRequest } from "next/server";
import { buildHandler } from "@/app/api/v1/utils/handler";
import { adaptPagination, zPagination } from "@/app/api/v1/utils/pagination";

export const dynamic = "force-dynamic";

export const GET = (
  req: NextRequest,
  { params }: { params: { tagId: string } },
) =>
  buildHandler({
    req,
    searchParamsSchema: zPagination,
    handler: async ({ api, searchParams }) => {
      const [tag, bookmarks] = await Promise.all([
        api.tags.get({
          tagId: params.tagId,
        }),
        api.bookmarks.getBookmarks({
          tagId: params.tagId,
          limit: searchParams.limit,
          cursor: searchParams.cursor,
        }),
      ]);
      return {
        status: 200,
        resp: {
          ...tag,
          ...adaptPagination(bookmarks),
        },
      };
    },
  });