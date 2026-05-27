// =========================
// GET WEATHER BY CITY
// =========================
export async function getWeather(city) {
  const geoRes = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
  );

  const geoData = await geoRes.json();

  if (!geoData.results || geoData.results.length === 0) {
    throw new Error("City not found");
  }

  const {
    latitude,
    longitude,
    name,
    country,
  } = geoData.results[0];

  // 🌦️ Weather
  const weatherRes = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`
  );

  const weatherData = await weatherRes.json();

  return {
    city: `${name}, ${country}`,
    weather: weatherData.current_weather,
    daily: weatherData.daily,
  };
}

// =========================
// GET WEATHER BY COORDS
// =========================
export async function getWeatherByCoords(lat, lon) {
  // 🌍 REAL reverse geocoding (WORKING)
  const geoRes = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
  );

  const geoData = await geoRes.json();

  const address = geoData.address || {};

  const cityName =
    address.city ||
    address.town ||
    address.village ||
    address.municipality ||
    address.county ||
    "Unknown";

  const country = address.country || "";

  // 🌦️ weather (Open-Meteo correct endpoint)
  const res = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`
  );

  const data = await res.json();

  return {
    city: `${cityName}, ${country}`,
    weather: data.current_weather,
    daily: data.daily,
  };
}