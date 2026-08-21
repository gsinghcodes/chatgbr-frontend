"use client";

import { useParams } from "next/navigation";

import Chat from "./chat/Chat";

export default function RepositoryWorkspace() {
  const params = useParams<{ id?: string; conversationId?: string }>();

  return (
    <Chat
      repositoryId={params.id}
      conversationId={params.conversationId}
    />
  );
}
