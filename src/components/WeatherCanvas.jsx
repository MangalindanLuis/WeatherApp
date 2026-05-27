import { useEffect, useRef } from "react";

export default function WeatherCanvas({ type }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const weatherType = (type || "").toLowerCase().trim();

    let rain = [];
    let snow = [];
    let clouds = [];

    let lightning = null;
    let flash = 0;
    let timer = 0;
    let animationId;

    // =========================
    // WIND
    // =========================
    const windStrength =
      weatherType === "storm"
        ? 2.5
        : weatherType === "rain"
        ? 1.2
        : weatherType === "snow"
        ? 0.6
        : 0.3;

    // =========================
    // CLOUDS
    // =========================
    function createClouds() {
      clouds = Array.from({ length: 12 }, () => ({
        x: Math.random() * w,
        y: Math.random() * (h * 0.35),
        size: 80 + Math.random() * 120,
        speed: 0.2 + Math.random() * 0.5,
        opacity: 0.08 + Math.random() * 0.12,
      }));
    }

    function drawClouds() {
      clouds.forEach((c) => {
        ctx.save();

        ctx.globalAlpha = c.opacity;

        // cluster cloud puffs
        const puffs = [
          { x: 0, y: 0, r: c.size * 0.6 },
          { x: c.size * 0.45, y: -10, r: c.size * 0.5 },
          { x: -c.size * 0.4, y: 5, r: c.size * 0.45 },
          { x: c.size * 0.1, y: -25, r: c.size * 0.55 },
          { x: -c.size * 0.15, y: 20, r: c.size * 0.4 },
        ];

        puffs.forEach((p) => {
          const g = ctx.createRadialGradient(
            c.x + p.x,
            c.y + p.y,
            10,
            c.x + p.x,
            c.y + p.y,
            p.r
          );

          g.addColorStop(0, "rgba(255,255,255,0.9)");
          g.addColorStop(1, "rgba(255,255,255,0)");

          ctx.fillStyle = g;

          ctx.beginPath();
          ctx.arc(c.x + p.x, c.y + p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        });

        ctx.restore();

        c.x += c.speed + windStrength * 0.2;

        if (c.x > w + 300) {
          c.x = -300;
          c.y = Math.random() * (h * 0.35);
        }
      });
    }

    // =========================
    // RAIN
    // =========================
    function createRain() {
      const count =
        weatherType === "storm"
          ? 450
          : weatherType === "rain"
          ? 220
          : 0;

      rain = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        len: 10 + Math.random() * 20,
        speed:
          weatherType === "storm"
            ? 12 + Math.random() * 8
            : 6 + Math.random() * 4,
      }));
    }

    function drawRain() {
      ctx.strokeStyle = "rgba(174,194,224,0.6)";
      ctx.lineWidth = 1;

      rain.forEach((r) => {
        ctx.beginPath();
        ctx.moveTo(r.x, r.y);
        ctx.lineTo(r.x + windStrength * 2, r.y + r.len);
        ctx.stroke();

        r.y += r.speed;
        r.x += windStrength;

        if (r.y > h) {
          r.y = -20;
          r.x = Math.random() * w;
        }
      });
    }

    // =========================
    // SNOW
    // =========================
    function createSnow() {
      snow = Array.from({ length: 200 }, () => {
        const depth = Math.random();

        return {
          x: Math.random() * w,
          y: Math.random() * h,
          r: depth * 2.5 + 0.8,
          speed: depth * 2 + 0.4,
          drift: (Math.random() - 0.5) * 0.8,
          opacity: depth * 0.6 + 0.4,
        };
      });
    }

    function drawSnow() {
      snow.forEach((s) => {
        ctx.beginPath();

        ctx.fillStyle = `rgba(255,255,255,${s.opacity})`;

        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();

        s.y += s.speed;
        s.x += s.drift + windStrength * 0.3;

        if (s.y > h) {
          s.y = -5;
          s.x = Math.random() * w;
        }

        if (s.x > w) s.x = 0;
        if (s.x < 0) s.x = w;
      });
    }

    // =========================
    // LIGHTNING
    // =========================
    function createLightning() {
      let x = Math.random() * w;
      let y = 0;

      const points = [];

      while (y < h * 0.7) {
        x += (Math.random() - 0.5) * 60;
        y += 25 + Math.random() * 40;

        points.push({ x, y });
      }

      return { points, alpha: 1 };
    }

    function triggerFlash() {
      flash = 0.8;
    }

    function handleLightning() {
      timer--;

      if (timer <= 0 && Math.random() < 0.03) {
        lightning = createLightning();
        triggerFlash();
        timer = 80 + Math.random() * 200;
      }
    }

    function drawLightning() {
      if (!lightning) return;

      ctx.strokeStyle = `rgba(255,255,255,${lightning.alpha})`;

      ctx.lineWidth = 2;

      ctx.shadowBlur = 25;
      ctx.shadowColor = "white";

      ctx.beginPath();

      ctx.moveTo(
        lightning.points[0].x,
        lightning.points[0].y
      );

      lightning.points.forEach((p) =>
        ctx.lineTo(p.x, p.y)
      );

      ctx.stroke();

      ctx.shadowBlur = 0;

      lightning.alpha -= 0.06;

      if (lightning.alpha <= 0) {
        lightning = null;
      }
    }

    function drawFlash() {
      if (flash <= 0) return;

      ctx.fillStyle = `rgba(255,255,255,${flash})`;

      ctx.fillRect(0, 0, w, h);

      flash -= 0.08;
    }

    // =========================
    // INIT
    // =========================
    createClouds();

    if (
      weatherType === "rain" ||
      weatherType === "storm"
    ) {
      createRain();
    }

    if (weatherType === "snow") {
      createSnow();
    }

    // =========================
    // LOOP
    // =========================
    function animate() {
      ctx.clearRect(0, 0, w, h);

      // ☁️ clouds always visible
      drawClouds();

      // 🌧️ rain
      if (
        weatherType === "rain" ||
        weatherType === "storm"
      ) {
        drawRain();
      }

      // ❄️ snow
      if (weatherType === "snow") {
        drawSnow();
      }

      // ⚡ storm
      if (weatherType === "storm") {
        handleLightning();
        drawLightning();
        drawFlash();
      }

      animationId = requestAnimationFrame(animate);
    }

    animate();

    // =========================
    // RESIZE
    // =========================
    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;

      createClouds();

      if (
        weatherType === "rain" ||
        weatherType === "storm"
      ) {
        createRain();
      }

      if (weatherType === "snow") {
        createSnow();
      }
    };

    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, [type]);

  return <canvas ref={canvasRef} />;
}