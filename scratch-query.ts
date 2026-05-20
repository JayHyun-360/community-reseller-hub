import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";

// Read .env.local
const envPath = path.join(process.cwd(), ".env.local");
const envContent = fs.readFileSync(envPath, "utf-8");

let url = "";
let anonKey = "";

envContent.split("\n").forEach((line) => {
  const parts = line.split("=");
  if (parts.length >= 2) {
    const key = parts[0].trim();
    const val = parts.slice(1).join("=").trim().replace(/['"]/g, "");
    if (key === "NEXT_PUBLIC_SUPABASE_URL") url = val;
    if (key === "NEXT_PUBLIC_SUPABASE_ANON_KEY") anonKey = val;
  }
});

if (!url || !anonKey) {
  console.error("Could not find Supabase URL/Key in .env.local");
  process.exit(1);
}

const supabase = createClient(url, anonKey);

async function run() {
  const { data: profiles, error: pError } = await supabase
    .from("profiles")
    .select("id, username, full_name, role");

  if (pError) {
    console.error("Error fetching data:", pError);
    return;
  }

  console.log("Profiles detailed list:");
  const detailed = profiles?.map(p => ({
    id: p.id,
    username: `'${p.username}'`,
    username_length: p.username?.length,
    full_name: `'${p.full_name}'`,
    role: p.role
  }));
  console.table(detailed);
}

run();
