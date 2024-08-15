exports.handler = async function(event, context) {
  const supabaseKey = process.env.SUPABASE_KEY;

  if (!supabaseKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'No API key found' })
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ key: supabaseKey })
  };
};
