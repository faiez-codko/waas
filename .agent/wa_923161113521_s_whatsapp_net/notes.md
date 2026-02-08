Backend syntax error in server/index.js

Observed error when running Node (Windows):
SyntaxError: Unexpected token '}' at server/index.js:68

Findings:
- server/index.js contains duplicated and malformed route handler blocks around the /agents POST route. Additional stray try/catch blocks appear outside function scope causing unexpected '}' tokens.
- There are duplicated /sessions POST and GET handlers as well.

Plan:
1. Clean up server/index.js by removing duplicated/stray blocks and keeping a single, well-formed set of routes.
2. Prefer authenticated routes for creating sessions and agents.
3. Commit and push the fix so the user can re-run on their machine.

Next steps: update task_plan.md status, fix index.js, run a quick node syntax check (node -c / node server/index.js) and push changes.
