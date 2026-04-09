import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const apply = process.argv.includes("--apply");

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error("SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY sao obrigatorias.");
  process.exit(1);
}

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

function isHashedPassword(value = "") {
  return value.startsWith("$2a$") || value.startsWith("$2b$") || value.startsWith("$2y$");
}

const { data, error } = await supabase.from("empresas").select("id,codigo,senha").order("created_at");

if (error) {
  console.error(error.message);
  process.exit(1);
}

const empresas = data || [];
const legadas = empresas.filter((empresa) => typeof empresa.senha === "string" && empresa.senha && !isHashedPassword(empresa.senha));

console.log(
  JSON.stringify(
    {
      total: empresas.length,
      legacyPasswords: legadas.length,
      mode: apply ? "apply" : "dry-run",
      codes: legadas.map((empresa) => empresa.codigo),
    },
    null,
    2,
  ),
);

if (!apply || legadas.length === 0) {
  process.exit(0);
}

for (const empresa of legadas) {
  const hashedPassword = await bcrypt.hash(empresa.senha.trim().toUpperCase(), 12);
  const { error: updateError } = await supabase.from("empresas").update({ senha: hashedPassword }).eq("id", empresa.id);

  if (updateError) {
    console.error(`Falha ao atualizar ${empresa.codigo}: ${updateError.message}`);
    process.exit(1);
  }
}

console.log(`Migracao concluida. ${legadas.length} empresa(s) atualizadas.`);
