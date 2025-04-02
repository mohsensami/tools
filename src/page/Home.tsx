import React, { useState, useEffect } from "react";

const Home = () => {
  const [time, setTime] = useState(new Date());
  const [greeting, setGreeting] = useState("");
  const [weather, setWeather] = useState({ temp: "72°", condition: "Sunny" });
  const [quote, setQuote] = useState(
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

  const updateGreeting = (now) => {
    const hours = now.getHours();
    let newGreeting = "";

    if (hours < 12) newGreeting = "Good Morning";
    else if (hours < 18) newGreeting = "Good Afternoon";
    else newGreeting = "Good Evening";

    setGreeting(newGreeting);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString([], {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  // Quick action buttons
  const quickActions = [
    {
      icon: "📅",
      label: "Calendar",
      action: () => console.log("Calendar clicked"),
    },
    { icon: "📝", label: "Notes", action: () => console.log("Notes clicked") },
    { icon: "🎵", label: "Music", action: () => console.log("Music clicked") },
    {
      icon: "☀️",
      label: "Weather",
      action: () => console.log("Weather clicked"),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 flex flex-col">
      {/* Header with greeting and weather */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">{greeting}</h1>
          <p className="text-lg text-gray-600">Welcome back!</p>
        </div>
        <div className="bg-white bg-opacity-70 rounded-lg p-3 shadow-sm flex items-center">
          <span className="text-3xl mr-2">
            {weather.condition === "Sunny"
              ? "☀️"
              : weather.condition === "Rainy"
              ? "🌧️"
              : "⛅"}
          </span>
          <span className="text-2xl font-semibold">{weather.temp}</span>
        </div>
      </div>

      {/* Main clock and date */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="text-center mb-8">
          <div className="text-8xl font-light text-gray-800 mb-2">
            {formatTime(time)}
          </div>
          <div className="text-2xl text-gray-600">{formatDate(time)}</div>
        </div>

        {/* Inspirational quote */}
        <div className="max-w-md bg-white bg-opacity-70 rounded-xl p-4 shadow-sm mb-12">
          <p className="text-gray-700 italic text-center">"{quote}"</p>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-4 gap-4 w-full max-w-lg">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className="bg-white bg-opacity-80 hover:bg-opacity-100 rounded-xl p-4 flex flex-col items-center justify-center shadow-sm transition-all duration-200 hover:shadow-md"
            >
              <span className="text-2xl mb-2">{action.icon}</span>
              <span className="text-sm font-medium text-gray-700">
                {action.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-gray-500 text-sm mt-8">
        Have a wonderful day!
      </div>
    </div>
  );
};

export default Home;
