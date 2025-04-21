import { Detail, getPreferenceValues } from "@raycast/api";
import { useFetch } from "@raycast/utils";

interface Preferences {
  apiKey: string;
}

interface GrokResponse {
  choices: { message: { content: string }}[];
}

export default function Command() {
  const preferences = getPreferenceValues<Preferences>();
  const {data, isLoading, error} = useFetch<GrokResponse>(
    "https://api.x.ai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${preferences.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "grok-3",
        messages: [{ role: "user", content: "Suggest 5 jazz songs" }],
      }),
    }
  );
}
const markdown = error
    ? `**Error**: ${error.message}`
    : data
      ? `**Jazz Song Suggestions**:\n${data.choices[0]?.message.content || "No response"}`
      : "Waiting for response...";

  return <Detail isLoading={isLoading} markdown={markdown} />;
}
