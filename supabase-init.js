async function getSupabaseKey() {
  const response = await fetch('/.netlify/functions/getSupabaseKey');
  const data = await response.json();
  return data.key;
}

async function initSupabase() {
  const supabaseKey = await getSupabaseKey();
  const supabaseUrl = 'https://your-supabase-url.supabase.co';
  window.supabase = supabase.createClient(supabaseUrl, supabaseKey);
  
  // Now you can use the Supabase client in your app
}

initSupabase();
