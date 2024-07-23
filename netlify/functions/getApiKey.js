// netlify/functions/getApiKey.js

exports.handler = async function(event, context) {
  return {
    statusCode: 200,
    body: JSON.stringify({ key: process.env.GOOGLE_MAPS_API_KEY }),
  };
};
