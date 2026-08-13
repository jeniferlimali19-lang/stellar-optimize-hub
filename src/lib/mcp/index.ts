import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listAccessKeysTool from "./tools/list-access-keys";
import createAccessKeyTool from "./tools/create-access-key";
import setAccessKeyActiveTool from "./tools/set-access-key-active";
import deleteAccessKeyTool from "./tools/delete-access-key";

const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "galaxy-control-panel",
  title: "Galaxy Control Panel",
  version: "0.1.0",
  instructions:
    "Tools for the Galaxy Control Panel app. Manage panel access keys: list them, create new ones, activate/deactivate, and delete.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listAccessKeysTool, createAccessKeyTool, setAccessKeyActiveTool, deleteAccessKeyTool],
});
