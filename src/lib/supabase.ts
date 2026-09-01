/**
 * Cliente Supabase do site público.
 *
 * O site é estático e não tem área logada: usa a chave anônima só para leitura
 * de dados públicos — hoje, o estado dos disjuntores de contratação.
 *
 * As credenciais vêm de variáveis de ambiente quando existirem; sem elas, cai
 * no projeto conhecido. A chave anônima já é pública por natureza — ela vai
 * embutida em qualquer front-end que fale com o Supabase.
 */
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ?? "https://vbikskbfkhundhropykf.supabase.co";

const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZiaWtza2Jma2h1bmRocm9weWtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1MTk5NjEsImV4cCI6MjA2MTA5NTk2MX0.-n-Tj_5JnF1NL2ZImWlMeTcobWDl_VD6Vqp0lxRQFFU";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false },
});
