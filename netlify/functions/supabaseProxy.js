const { createClient } = require('@supabase/supabase-js');

exports.handler = async function(event, context) {
  const supabaseUrl = 'https://your-supabase-url.supabase.co';
  const supabaseKey = process.env.SUPABASE_KEY;
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Example of an operation - fetching users
  const { data, error } = await supabase
    .from('users')
    .select('*');

  if (error) {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*', // Allow any origin
        'Access-Control-Allow-Headers': 'Content-Type', // Allow specific headers
      },
      body: JSON.stringify({ error: error.message })
    };
  }

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*', // Allow any origin
      'Access-Control-Allow-Headers': 'Content-Type', // Allow specific headers
    },
    body: JSON.stringify(data)
  };
};
