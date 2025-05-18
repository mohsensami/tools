import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";

interface Weather {
  temp: string;
  condition: "Sunny" | "Rainy" | "Cloudy";
}

interface QuickAction {
  icon: string;
  label: string;
  action: () => void;
  color: string;
}

const Home: React.FC = () => {
  const [time, setTime] = useState<Date>(new Date());
  const [greeting, setGreeting] = useState<string>("");
  const [weather, setWeather] = useState<Weather>({
    temp: "72°",
    condition: "Sunny",
  });
  const [quote, setQuote] = useState<string>(
    "The only way to do great work is to love what you do."
  );

  // Refs for GSAP animations
  const headerRef = useRef<HTMLDivElement>(null);
  const clockRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  // Initialize animations
  useEffect(() => {
    const tl = gsap.timeline();

    tl.from(headerRef.current, {
      opacity: 0,
      y: -20,
      duration: 0.8,
      ease: "power2.out",
    })
      .from(
        clockRef.current,
        {
          opacity: 0,
          scale: 0.9,
          duration: 0.8,
          ease: "back.out(1.7)",
        },
        "-=0.4"
      )
      .from(
        quoteRef.current,
        {
          opacity: 0,
          y: 20,
          duration: 0.8,
          ease: "power2.out",
        },
        "-=0.4"
      )
      .from(
        footerRef.current,
        {
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
        },
        "-=0.4"
      );

    // Quick actions hover animations
    const quickActions = document.querySelectorAll(".quick-action");
    quickActions.forEach((action) => {
      action.addEventListener("mouseenter", () => {
        gsap.to(action, {
          scale: 1.05,
          duration: 0.3,
          ease: "power2.out",
        });
      });
      action.addEventListener("mouseleave", () => {
        gsap.to(action, {
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
        });
      });
    });

    return () => {
      quickActions.forEach((action) => {
        action.removeEventListener("mouseenter", () => {});
        action.removeEventListener("mouseleave", () => {});
      });
    };
  }, []);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTime(now);
      updateGreeting(now);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const updateGreeting = (now: Date): void => {
    const hours = now.getHours();
    let newGreeting = "";

    if (hours < 12) newGreeting = "Good Morning";
    else if (hours < 18) newGreeting = "Good Afternoon";
    else newGreeting = "Good Evening";

    setGreeting(newGreeting);
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString([], {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  // Quick action buttons with colors
  const quickActions: QuickAction[] = [
    {
      icon: "📅",
      label: "Calendar",
      action: () => console.log("Calendar clicked"),
      color: "from-blue-400 to-blue-600",
    },
    {
      icon: "📝",
      label: "Notes",
      action: () => console.log("Notes clicked"),
      color: "from-purple-400 to-purple-600",
    },
    {
      icon: "🎵",
      label: "Music",
      action: () => console.log("Music clicked"),
      color: "from-pink-400 to-pink-600",
    },
    {
      icon: "☀️",
      label: "Weather",
      action: () => console.log("Weather clicked"),
      color: "from-yellow-400 to-yellow-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-8 flex flex-col">
      {/* Header with greeting and weather */}
      <div ref={headerRef} className="flex justify-between items-start mb-12">
        <div>
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            {greeting}
          </h1>
          <p className="text-xl text-gray-600 mt-2">Welcome back!</p>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg flex items-center space-x-3">
          <span className="text-4xl">
            {weather.condition === "Sunny"
              ? "☀️"
              : weather.condition === "Rainy"
              ? "🌧️"
              : "⛅"}
          </span>
          <div>
            <span className="text-3xl font-bold text-gray-800">
              {weather.temp}
            </span>
            <p className="text-sm text-gray-600">{weather.condition}</p>
          </div>
        </div>
      </div>

      {/* Main clock and date */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div ref={clockRef} className="text-center mb-12">
          <div className="text-9xl font-light bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 mb-4">
            {formatTime(time)}
          </div>
          <div className="text-3xl text-gray-600 font-medium">
            {formatDate(time)}
          </div>
        </div>

        {/* Inspirational quote */}
        <div
          ref={quoteRef}
          className="max-w-2xl bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg mb-16"
        >
          <p className="text-xl text-gray-700 italic text-center leading-relaxed">
            "{quote}"
          </p>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-4 gap-6 w-full max-w-4xl">
          {quickActions.map((action, index) => (
            <button
              key={index}
              className={`quick-action bg-gradient-to-br ${action.color} rounded-2xl p-6 flex flex-col items-center justify-center shadow-lg transition-all duration-300 hover:shadow-xl`}
              onClick={action.action}
            >
              <span className="text-4xl mb-3">{action.icon}</span>
              <span className="text-white font-medium text-lg">
                {action.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div ref={footerRef} className="text-center text-gray-500 text-sm mt-12">
        Have a wonderful day! ✨
      </div>
    </div>
  );
};

export default Home;
