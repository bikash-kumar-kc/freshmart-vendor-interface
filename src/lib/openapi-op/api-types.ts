// Yours to edit — openapi-op writes this once and never again.
// Binds the generic helpers to *this* project's spec, so call sites read
// `Req<"/api/v1/auth/login", "post">` and not the three-parameter form.

import type { components, paths } from "./schema";
import type * as t from "openapi-op";

export type Schema<K extends keyof components["schemas"]> = components["schemas"][K];
export type ApiPath = keyof paths;
export type ApiMethod<P extends ApiPath> = t.ApiMethod<paths, P>;
export type Req<P extends ApiPath, M extends ApiMethod<P>> = t.Req<paths, P, M>;
export type Res<P extends ApiPath, M extends ApiMethod<P>> = t.Res<paths, P, M>;
export type Query<P extends ApiPath, M extends ApiMethod<P>> = t.Query<paths, P, M>;
export type Params<P extends ApiPath, M extends ApiMethod<P>> = t.Params<paths, P, M>;
