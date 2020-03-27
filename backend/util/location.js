const axios = require('axios');

const HttpError = require('../model/http-error');

async function getCoordsForAddress(address) {
  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${process.env.API_KEY}`
  );
  const data = response.data;

  if (!data || data.status === 'ZERO_RESULTS') {
    throw new HttpError('Could not find the location', 422);
  }

  const coordinates = data.results[0].geometry.location;

  return coordinates;
}

module.exports = getCoordsForAddress;
