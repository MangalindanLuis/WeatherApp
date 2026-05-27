import { useState, useEffect } from "react";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";
import Forecast from "./components/Forecast";
import WeatherCanvas from "./components/WeatherCanvas";

import {
  getWeather,
  getWeatherByCoords,
} from "./services/weatherApi";

function mapWeather(code) {
  if (code === 0) return "clear";
  if (code >= 1 && code <= 3) return "clouds";
  if (code >= 45 && code <= 48) return "clouds";
  if (code >= 51 && code <= 67) return "rain";
  if (code >= 71 && code <= 77) return "snow";
  if (code >= 80) return "rain";
  if (code >= 95) return "storm";
  return "clear";
}

export default function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [type, setType] = useState("clouds");

  // =========================
  // SEARCH
  // =========================
  const handleSearch = async () => {
    if (!city.trim()) return;

    try {
      const data = await getWeather(city);
      setWeather(data);
    } catch (err) {
      console.log("Search failed:", err);
    }
  };

  // =========================
  // FALLBACK WEATHER
  // =========================
  const loadFallback = async () => {
    try {
      const data = await getWeather("Angeles City");
      setWeather(data);
    } catch (err) {
      console.log("Fallback failed:", err);
    }
  };

  // =========================
  // AUTO LOCATION (FIXED)
  // =========================
  useEffect(() => {
    if (!navigator.geolocation) {
      loadFallback();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const data = await getWeatherByCoords(
            pos.coords.latitude,
            pos.coords.longitude
          );

          setWeather(data);
        } catch (err) {
          loadFallback();
        }
      },
      (err) => {
        console.log("Geolocation denied:", err);
        loadFallback();
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  // =========================
  // WEATHER TYPE MAPPING
  // =========================
  useEffect(() => {
    const code = weather?.weather?.weathercode;

    if (typeof code === "number") {
      setType(mapWeather(code));
    }
  }, [weather]);

  return (
    <div className={`app ${type}`}>
      {/* background FX */}
      <WeatherCanvas type={type} />

      {/* UI */}
      <div className="ui-layer">
        <h1>Weather</h1>

        <SearchBar
          city={city}
          setCity={setCity}
          onSearch={handleSearch}
        />

        <WeatherCard data={weather} />

        {weather?.daily && (
          <Forecast data={weather.daily} />
        )}
      </div>
    </div>
  );
}