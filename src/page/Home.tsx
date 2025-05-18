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
  gradient: string;
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
      y: -30,
      duration: 1,
      ease: "power3.out",
    })
      .from(
        clockRef.current,
        {
          opacity: 0,
          scale: 0.8,
          duration: 1.2,
          ease: "elastic.out(1, 0.5)",
        },
        "-=0.6"
      )
      .from(
        quoteRef.current,
        {
          opacity: 0,
          y: 30,
          duration: 1,
          ease: "power3.out",
        },
        "-=0.8"
      )
      .from(
        footerRef.current,
        {
          opacity: 0,
          duration: 1,
          ease: "power2.out",
        },
        "-=0.6"
      );

    // Quick actions hover animations
    const quickActions = document.querySelectorAll(".quick-action");
    quickActions.forEach((action) => {
      action.addEventListener("mouseenter", () => {
        gsap.to(action, {
          scale: 1.05,
          y: -5,
          duration: 0.4,
          ease: "power2.out",
        });
      });
      action.addEventListener("mouseleave", () => {
        gsap.to(action, {
          scale: 1,
          y: 0,
          duration: 0.4,
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

  // Quick action buttons with enhanced colors and gradients
  const quickActions: QuickAction[] = [
    {
      icon: "📅",
      label: "Calendar",
      action: () => console.log("Calendar clicked"),
      color: "from-blue-500 to-blue-700",
      gradient: "bg-gradient-to-br from-blue-500 to-blue-700",
    },
    {
      icon: "📝",
      label: "Notes",
      action: () => console.log("Notes clicked"),
      color: "from-purple-500 to-purple-700",
      gradient: "bg-gradient-to-br from-purple-500 to-purple-700",
    },
    {
      icon: "🎵",
      label: "Music",
      action: () => console.log("Music clicked"),
      color: "from-pink-500 to-pink-700",
      gradient: "bg-gradient-to-br from-pink-500 to-pink-700",
    },
    {
      icon: "☀️",
      label: "Weather",
      action: () => console.log("Weather clicked"),
      color: "from-amber-500 to-amber-700",
      gradient: "bg-gradient-to-br from-amber-500 to-amber-700",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 p-8 flex flex-col relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header with greeting and weather */}
      <div
        ref={headerRef}
        className="flex justify-between items-start mb-12 relative z-10"
      >
        <div>
          <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
            {greeting}
          </h1>
          <p className="text-2xl text-gray-600 mt-3 font-light">
            Welcome back!
          </p>
        </div>
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-5 shadow-xl flex items-center space-x-4 transform hover:scale-105 transition-transform duration-300">
          <span className="text-5xl">
            {weather.condition === "Sunny"
              ? "☀️"
              : weather.condition === "Rainy"
              ? "🌧️"
              : "⛅"}
          </span>
          <div>
            <span className="text-4xl font-bold text-gray-800">
              {weather.temp}
            </span>
            <p className="text-sm text-gray-600 font-medium">
              {weather.condition}
            </p>
          </div>
        </div>
      </div>

      {/* Main clock and date */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10">
        <div ref={clockRef} className="text-center mb-12">
          <div className="text-[12rem] font-light bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 mb-6 tracking-tight">
            {formatTime(time)}
          </div>
          <div className="text-4xl text-gray-600 font-medium tracking-wide">
            {formatDate(time)}
          </div>
        </div>

        {/* Inspirational quote */}
        <div
          ref={quoteRef}
          className="max-w-3xl bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-xl mb-16 transform hover:scale-105 transition-transform duration-300"
        >
          <p className="text-2xl text-gray-700 italic text-center leading-relaxed font-light">
            "{quote}"
          </p>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-4 gap-8 w-full max-w-5xl">
          {quickActions.map((action, index) => (
            <button
              key={index}
              className={`quick-action ${action.gradient} rounded-3xl p-8 flex flex-col items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300`}
              onClick={action.action}
            >
              <span className="text-5xl mb-4">{action.icon}</span>
              <span className="text-white font-medium text-xl">
                {action.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div
        ref={footerRef}
        className="text-center text-gray-500 text-lg mt-12 relative z-10 font-light"
      >
        Have a wonderful day! ✨
      </div>
    </div>
  );
};

export default Home;
