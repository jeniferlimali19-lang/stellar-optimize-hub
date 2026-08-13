import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_access_keys",
  title: "List access keys",
  description: "List the panel access keys (id, label, active status, creation date).",
  inputSchema: {
    limit: z.number().int().min(1).max(200).optional().describe("Max number of keys to return (default 50)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ limit }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase
      .from("access_keys")
      .select("id, label, active, created_at")
      .order("created_at", { ascending: false })
      .limit(limit ?? 50);

    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? []) }],
      structuredContent: { keys: data ?? [] },
    };
  },
});
