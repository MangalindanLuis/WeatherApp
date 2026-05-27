import {
  WiDaySunny,
  WiCloudy,
  WiRain,
  WiSnow,
  WiThunderstorm,
} from "react-icons/wi";

export default function Forecast({ data }) {
  if (!data) return null;

  const {
    time,
    temperature_2m_max,
    temperature_2m_min,
    weathercode,
  } = data;

  const getWeatherText = (code) => {
    if (code === 0) return "Clear sky";
    if (code === 1) return "Mainly clear";
    if (code === 2) return "Partly cloudy";
    if (code === 3) return "Overcast";
    if (code >= 61) return "Rain";
    return "Unknown";
  };

  const getWeatherIcon = (code) => {
    if (code === 0) return <WiDaySunny className="weather-icon clear" />;
    if (code <= 3) return <WiCloudy className="weather-icon cloudy" />;
    if (code >= 61) return <WiRain className="weather-icon rain" />;
    if (code >= 71) return <WiSnow className="weather-icon snow" />;
    if (code >= 95)
      return <WiThunderstorm className="weather-icon storm" />;

    return <WiCloudy className="weather-icon cloudy" />;
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);

    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="forecast">
      <h3>7-Day Forecast</h3>

      <div className="forecast-grid">
        {time?.map((day, i) => (
          <div key={day} className="forecast-card">
  <div className="forecast-row">

    {/* LEFT SIDE */}
    <div className="forecast-left">
      <p className="date">{formatDate(day)}</p>

      <p className="temp">
        {Math.round(temperature_2m_max?.[i])}°
        {" / "}
        {Math.round(temperature_2m_min?.[i])}°
      </p>

      <p className="code">
        {getWeatherText(weathercode?.[i])}
      </p>
    </div>

    {/* RIGHT SIDE ICON */}
    {getWeatherIcon(weathercode?.[i])}

  </div>
</div>
        ))}
      </div>
    </div>
  );
}