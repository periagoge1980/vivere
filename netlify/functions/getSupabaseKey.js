exports.handler = async function(event, context) {
  return {
    statusCode: 200,
    body: JSON.stringify({ key: process.env.SUPABASE_KEY }),
  };
};
