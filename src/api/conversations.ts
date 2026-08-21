import { apiInstance } from "./axios";

export interface Conversation {
  id: string;
  repository_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface ConversationMessage {
  id: string;
  conversation_id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

export async function getConversations(
  repositoryId: string,
): Promise<Conversation[]> {
  const response = await apiInstance.get(
    `/repositories/${repositoryId}/conversations`,
  );

  return response.data.data;
}

export async function getConversationMessages(
  conversationId: string,
  page: number,
  limit: number,
) {
  const response = await apiInstance.post(
    `/conversations/${conversationId}/messages`, {
      page,
      limit
    }
  );

  return response.data.data;
}