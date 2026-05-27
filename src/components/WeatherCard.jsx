import {
  WiDaySunny,
  WiNightClear,
  WiRain,
  WiCloudy,
  WiNightAltCloudy,
  WiFog,
} from "react-icons/wi";

const weatherCodeMap = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  61: "Rain",
};

// 🌙 detect night (simple + reliable)
const isNight = () => {
  const hour = new Date().getHours();
  return hour < 6 || hour > 18;
};

// 🎨 unified icon system
const getWeatherIcon = (code) => {
  const night = isNight();

  if (code === 0) return night ? <WiNightClear size={70} /> : <WiDaySunny size={70} />;
  if (code === 1 || code === 2) {
    return night ? <WiNightAltCloudy size={70} /> : <WiCloudy size={70} />;
  }
  if (code === 3) return <WiCloudy size={70} />;
  if (code === 45) return <WiFog size={70} />;
  if (code >= 61) return <WiRain size={70} />;

  return <WiCloudy size={70} />;
};

export default function WeatherCard({ data }) {
  if (!data) return null;

  const code = data.weather.weathercode;

  return (
    <div className="card">
      <h2>{data.city}</h2>

      {/* ICON */}
      <div className="weather-main-icon">{getWeatherIcon(code)}</div>

      <h1>{data.weather.temperature}°C</h1>

      <p>{weatherCodeMap[code] || "Unknown"}</p>

      <p>Wind: {data.weather.windspeed} km/h</p>
    </div>
  );
}