const { createClient } = require('@supabase/supabase-js');

exports.handler = async function(event, context) {
  try {
    const supabaseUrl = 'https://ssdnvbiiznvjuobrrhpt.supabase.co';
    const supabaseKey = process.env.SUPABASE_KEY;

    if (!supabaseKey) {
      throw new Error('SUPABASE_KEY is not set');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Example of an operation - fetching users
    const { data, error } = await supabase
      .from('users')
      .select('*');

    if (error) {
      console.error('Error fetching users:', error);
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*', // Allow any origin
          'Access-Control-Allow-Headers': 'Content-Type', // Allow specific headers
        },
        body: JSON.stringify({ error: error.message }),
      };
    }

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*', // Allow any origin
        'Access-Control-Allow-Headers': 'Content-Type', // Allow specific headers
      },
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error('Unexpected error in supabaseProxy:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*', // Allow any origin
        'Access-Control-Allow-Headers': 'Content-Type', // Allow specific headers
      },
      body: JSON.stringify({ error: error.message }),
    };
  }
};
