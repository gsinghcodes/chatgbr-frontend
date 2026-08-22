export interface ChatRequest {
  question: string;
  conversation_id?: string;
}

interface StreamEvent {
  type: "conversation" | "token" | "done" | "error" | "reasoning";
  content?: string;
  conversation_id?: string;
  title?: string;
  message?: string;
}

export async function streamChat(
  repositoryId: string,
  data: ChatRequest,
  onEvent: (event: StreamEvent) => void,
) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const makeRequest = async () => {
    const token = localStorage.getItem("access_token");

    return fetch(
      `${apiUrl}/repositories/${repositoryId}/chat`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/event-stream",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(data),
      },
    );
  };

  let response = await makeRequest();

  if (response.status === 401) {
    const refreshResponse = await fetch(
      `${apiUrl}/auth/refresh`,
      {
        method: "POST",
        credentials: "include",
      },
    );

    if (!refreshResponse.ok) {
      throw new Error(
        "Session expired. Please log in again.",
      );
    }

    const refreshData = await refreshResponse.json();

    const accessToken =
      refreshData.data.access_token;

    localStorage.setItem(
      "access_token",
      accessToken,
    );

    response = await makeRequest();
  }

  if (!response.ok) {
    throw new Error(
      `Failed to start chat: ${response.status}`,
    );
  }

  if (!response.body) {
    throw new Error(
      "Streaming is not supported by this response.",
    );
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();

    if (done) {
      break;
    }

    buffer += decoder.decode(value, {
      stream: true,
    });

    const events = buffer.split("\n\n");

    buffer = events.pop() ?? "";

    for (const event of events) {
      const line = event
        .split("\n")
        .find((line) => line.startsWith("data: "));

      if (!line) {
        continue;
      }

      const json = line.slice(6);

      try {
        const parsed: StreamEvent = JSON.parse(json);

        onEvent(parsed);

        if (parsed.type === "error") {
          throw new Error(
            parsed.message ??
              "Unable to generate response.",
          );
        }
      } catch (error) {
        if (error instanceof Error) {
          throw error;
        }

        console.error(
          "Failed to parse stream event:",
          error,
        );
      }
    }
  }
}