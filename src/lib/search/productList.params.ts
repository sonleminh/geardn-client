// src/lib/search/productList.params.ts
import { z } from "zod";

export const SortEnum = z.enum(["desc","asc"]);
export const productListParamsSchema = z.object({
  q: z.string().trim().max(200).optional().default(""),
  page: z.coerce.number().int().min(1).max(200).optional().default(1),
  limit: z.coerce.number().int().min(1).max(60).optional().default(12),
  sort: SortEnum.optional().default("asc"),
});
export type ProductListParams = z.infer<typeof productListParamsSchema>;

export function parseProductListParams(input: Record<string, string | string[] | undefined>): ProductListParams {
  // lấy 1 giá trị duy nhất khi trùng key
  const norm = Object.fromEntries(
    Object.entries(input).map(([k,v]) => [k, Array.isArray(v) ? v[0] : v])
  );
  return productListParamsSchema.parse(norm);
}
