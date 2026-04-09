import dotenv from "dotenv";

dotenv.config();

function getProjectRef(supabaseUrl) {
  try {
    return new URL(supabaseUrl).hostname.split(".")[0] || "";
  } catch {
    return "";
  }
}

function pickServerKey(keys) {
  const normalized = Array.isArray(keys)
    ? keys.map((key) => ({
        apiKey: key?.api_key || key?.apiKey || "",
        name: `${key?.name || ""}`.toLowerCase(),
        description: `${key?.description || ""}`.toLowerCase(),
      }))
    : [];

  const isUsableKey = (value) =>
    typeof value === "string" &&
    value.length > 20 &&
    !value.includes("·") &&
    !value.includes("...") &&
    /^[A-Za-z0-9._-]+$/.test(value);

  return (
    normalized.find((key) => key.apiKey.startsWith("sb_secret_") && isUsableKey(key.apiKey))?.apiKey ||
    normalized.find((key) => key.name.includes("secret") && isUsableKey(key.apiKey))?.apiKey ||
    normalized.find((key) => key.description.includes("secret") && isUsableKey(key.apiKey))?.apiKey ||
    normalized.find((key) => key.name.includes("service_role") && isUsableKey(key.apiKey))?.apiKey ||
    normalized.find((key) => key.description.includes("service_role") && isUsableKey(key.apiKey))?.apiKey ||
    normalized.find(
      (key) =>
        key.apiKey.startsWith("eyJ") &&
        isUsableKey(key.apiKey) &&
        !key.name.includes("anon") &&
        !key.name.includes("publishable") &&
        !key.description.includes("anon") &&
        !key.description.includes("publishable"),
    )?.apiKey ||
    ""
  );
}

async function resolveSupabaseServerKey() {
  const currentKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

  if (!currentKey.startsWith("sbp_")) {
    return;
  }

  const projectRef = getProjectRef(process.env.SUPABASE_URL || "");

  if (!projectRef) {
    console.warn("[startup] SUPABASE_SERVICE_ROLE_KEY parece ser um PAT, mas SUPABASE_URL nao permitiu derivar o project ref.");
    return;
  }

  try {
    console.warn("[startup] Resolvendo chave do projeto a partir de um token pessoal do Supabase.");

    const response = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/api-keys`, {
      headers: {
        Authorization: `Bearer ${currentKey}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      console.warn(`[startup] Falha ao resolver chave do projeto no Supabase Management API: ${response.status}.`);
      return;
    }

    const keys = await response.json();
    const resolvedKey = pickServerKey(keys);

    if (!resolvedKey) {
      console.warn("[startup] Nenhuma chave de servidor utilizavel foi encontrada para o projeto Supabase.");
      return;
    }

    process.env.SUPABASE_SERVICE_ROLE_KEY = resolvedKey;
    console.warn("[startup] Chave de servidor do Supabase resolvida com sucesso para este boot.");
  } catch (error) {
    console.warn("[startup] Nao foi possivel resolver a chave de servidor do Supabase automaticamente.", error);
  }
}

await resolveSupabaseServerKey();
await import("../server/index.js");
