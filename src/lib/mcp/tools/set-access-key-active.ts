import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "set_access_key_active",
  title: "Activate or deactivate access key",
  description: "Enable or disable an existing panel access key by id.",
  inputSchema: {
    id: z.string().uuid().describe("Access key id."),
    active: z.boolean().describe("True to activate the key, false to deactivate it."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  handler: async ({ id, active }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase
      .from("access_keys")
      .update({ active })
      .eq("id", id)
      .select("id, label, active, created_at");

    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    if (!data?.length) return { content: [{ type: "text", text: `No access key found with id ${id}` }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data[0]) }],
      structuredContent: { key: data[0] },
    };
  },
});
