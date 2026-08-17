# Agent MCP

Project-specific Cursor MCP servers should be registered in `.cursor/mcp.json`.

Keep this file as a safe placeholder until an MCP server is intentionally added. When adding one:

- Put server definitions under `mcpServers`.
- Read secrets from environment variables; do not commit API keys, tokens, or passwords.
- Prefer project-scoped servers that help QA work, such as internal docs, test management, issue tracking, or local automation tooling.
- Validate that Cursor can start the server before depending on it in rules or skills.
