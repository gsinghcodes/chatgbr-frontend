import { useInfiniteQuery } from "@tanstack/react-query";

import { getConversationMessages } from "@/api/conversations";

const PAGE_LIMIT = 20;

export function useConversationMessages(conversationID?: string) {
  return useInfiniteQuery({
    queryKey: ["conversation-messages", conversationID],
    queryFn: ({ pageParam }) => getConversationMessages(conversationID as string, pageParam, PAGE_LIMIT),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.has_next
        ? lastPage.pagination.page + 1
        : undefined,
    enabled: !!conversationID
  })
};