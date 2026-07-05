export interface ChatMessage {
  role: "user" | "model" | "system";
  content: string;
}

/**
 * Sends messages history to the Next.js API Chat Route Handler.
 * Returns the text response and metadata.
 */
export async function sendChatMessage(messages: ChatMessage[]): Promise<{ content: string; isMock: boolean }> {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `API error (${response.status})`);
    }

    return await response.json();
  } catch (error) {
    console.error("sendChatMessage failed, using client-side emergency mock:", error);
    // Client-side failover in case of network issue
    return {
      content: `### ⚠️ Connection Offline
      
We encountered a network issue communicating with the AI server. 

However, simulated backup logic indicates that:
* City Health Score is **stable at 84%**.
* Active Incidents count is **12**.
* Please check your internet connectivity or environment variables (GEMINI_API_KEY).`,
      isMock: true
    };
  }
}
