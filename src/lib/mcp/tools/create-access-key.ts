import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "create_access_key",
  title: "Create access key",
  description: "Create a new panel access key with a password and optional label.",
  inputSchema: {
    password: z.string().trim().min(1).describe("Password used to log into the panel."),
    label: z.string().trim().min(1).optional().describe("Optional label to identify the key owner."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
  handler: async ({ password, label }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase
      .from("access_keys")
      .insert({ password, label: label ?? null })
      .select("id, label, active, created_at");

    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data?.[0] ?? null) }],
      structuredContent: { key: data?.[0] ?? null },
    };
  },
});
