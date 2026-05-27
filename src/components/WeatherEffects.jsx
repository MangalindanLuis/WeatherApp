export default function WeatherEffects({ type }) {
  return (
    <div className="weather-overlay">
      {type === "rain" && (
        <div className="rain">
          {Array.from({ length: 60 }).map((_, i) => (
            <span key={i} />
          ))}
        </div>
      )}

      {type === "snow" && (
        <div className="snow">
          {Array.from({ length: 40 }).map((_, i) => (
            <span key={i} />
          ))}
        </div>
      )}

      {type === "clear" && <div className="sun" />}

      {type === "cloudy" && (
        <div className="clouds">
          <div className="cloud" />
          <div className="cloud" />
        </div>
      )}
    </div>
  );
}