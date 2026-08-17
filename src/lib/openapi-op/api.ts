// Yours to edit — openapi-op writes this once and never again.
//
// `baseUrl` and `headers` are functions so they can be resolved per request
// (a Host header, a session cookie) rather than once at import time.

import { createClient } from "openapi-op";
import type { paths } from "./schema";

export { ApiError } from "openapi-op";

export const { api, op } = createClient<paths>({
  baseUrl: () => process.env.API_ORIGIN ?? "http://localhost:8000",
  prefix: "/api/v1",
  // headers: async () => ({ authorization: `Bearer ${await token()}` }),
});
