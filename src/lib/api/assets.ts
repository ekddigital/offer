import { env } from "@/lib/env";
import { listAssetsSchema } from "@/lib/validation/assets";

export async function listAssets(input: unknown) {
  const payload = listAssetsSchema.parse(input);

  const searchParams = new URLSearchParams({
    page: payload.page.toString(),
    size: payload.size.toString(),
  });

  if (payload.clientId) searchParams.set("client_id", payload.clientId);
  if (payload.projectName)
    searchParams.set("project_name", payload.projectName);
  if (payload.assetType) searchParams.set("asset_type", payload.assetType);
  if (payload.search) searchParams.set("search", payload.search);

  const response = await fetch(
    `${env.ASSETS_BASE_URL}/api/v1/assets?${searchParams.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${env.ASSETS_API_KEY}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Assets API error: ${response.status}`);
  }

  return response.json();
}
