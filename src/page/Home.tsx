import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

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
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-start mb-12"
      >
        <div>
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            {greeting}
          </h1>
          <p className="text-xl text-gray-600 mt-2">Welcome back!</p>
        </div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg flex items-center space-x-3"
        >
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
        </motion.div>
      </motion.div>

      {/* Main clock and date */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-12"
        >
          <div className="text-9xl font-light bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 mb-4">
            {formatTime(time)}
          </div>
          <div className="text-3xl text-gray-600 font-medium">
            {formatDate(time)}
          </div>
        </motion.div>

        {/* Inspirational quote */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg mb-16"
        >
          <p className="text-xl text-gray-700 italic text-center leading-relaxed">
            "{quote}"
          </p>
        </motion.div>

        {/* Quick actions */}
        <div className="grid grid-cols-4 gap-6 w-full max-w-4xl">
          {quickActions.map((action, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={action.action}
              className={`bg-gradient-to-br ${action.color} rounded-2xl p-6 flex flex-col items-center justify-center shadow-lg transition-all duration-300 hover:shadow-xl`}
            >
              <span className="text-4xl mb-3">{action.icon}</span>
              <span className="text-white font-medium text-lg">
                {action.label}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center text-gray-500 text-sm mt-12"
      >
        Have a wonderful day! ✨
      </motion.div>
    </div>
  );
};

export default Home;
