import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://xdvlefctqhuwwkfhpwlc.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhkdmxlZmN0cWh1d3drZmhwd2xjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDU0MTMzMTIsImV4cCI6MjAyMDk4OTMxMn0.uST-2rRaNnkxNKV04iinPDQ1c5hDQKON-1GwfciDNEQ";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
