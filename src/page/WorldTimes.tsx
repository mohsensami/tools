import React, { useState, useEffect } from "react";
import axios from "axios";

interface TimeZone {
  timezone: string;
  datetime: string;
  country_code: string;
}

const WorldTimes = () => {
  const [selectedTime, setSelectedTime] = useState<TimeZone | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedZone, setSelectedZone] = useState("Asia/Tehran");

  const timeZones = [
    { timezone: "Asia/Tehran", name: "Iran" },
    { timezone: "America/New_York", name: "New York" },
    { timezone: "Europe/London", name: "London" },
    { timezone: "Asia/Tokyo", name: "Tokyo" },
    { timezone: "Asia/Dubai", name: "Dubai" },
    { timezone: "Europe/Paris", name: "Paris" },
    { timezone: "Asia/Shanghai", name: "Shanghai" },
    { timezone: "Australia/Sydney", name: "Sydney" },
    { timezone: "Pacific/Auckland", name: "Auckland" },
    { timezone: "Asia/Singapore", name: "Singapore" },
    { timezone: "Europe/Berlin", name: "Berlin" },
    { timezone: "America/Los_Angeles", name: "Los Angeles" },
    { timezone: "Asia/Seoul", name: "Seoul" },
  ];

  const fetchTime = async (zone: string) => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `https://timeapi.io/api/Time/current/zone?timeZone=${zone}`
      );
      const selectedZoneInfo = timeZones.find((tz) => tz.timezone === zone);
      setSelectedTime({
        timezone: zone,
        datetime: response.data.dateTime,
        country_code: selectedZoneInfo?.name || zone,
      });
    } catch (err) {
      setError("Failed to fetch time. Please try again later.");
      console.error("Error fetching time:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTime(selectedZone);
    const interval = setInterval(() => fetchTime(selectedZone), 60000);
    return () => clearInterval(interval);
  }, [selectedZone]);

  const handleZoneChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedZone(event.target.value);
  };

  const formatTime = (datetime: string) => {
    return new Date(datetime).toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      month: "short",
      day: "numeric",
      weekday: "long",
    });
  };

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "600px",
        margin: "40px auto",
        backgroundColor: "white",
        borderRadius: "15px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "30px", color: "#333" }}>
        World Time
      </h1>

      <div
        style={{
          marginBottom: "30px",
          display: "flex",
          gap: "10px",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <select
          value={selectedZone}
          onChange={handleZoneChange}
          style={{
            padding: "12px",
            fontSize: "16px",
            borderRadius: "8px",
            border: "1px solid #ddd",
            width: "200px",
            cursor: "pointer",
          }}
        >
          {timeZones.map((zone) => (
            <option key={zone.timezone} value={zone.timezone}>
              {zone.name}
            </option>
          ))}
        </select>

        <button
          onClick={() => fetchTime(selectedZone)}
          style={{
            padding: "12px 20px",
            backgroundColor: "#3498db",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px",
            transition: "background-color 0.2s",
          }}
        >
          Refresh
        </button>
      </div>

      {loading && (
        <div style={{ textAlign: "center", padding: "20px" }}>
          Loading time...
        </div>
      )}

      {error && (
        <div
          style={{
            textAlign: "center",
            padding: "20px",
            color: "red",
            backgroundColor: "#fff3f3",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        >
          {error}
        </div>
      )}

      {selectedTime && !loading && !error && (
        <div
          style={{
            textAlign: "center",
            padding: "30px",
            backgroundColor: "#f8f9fa",
            borderRadius: "12px",
          }}
        >
          <h2 style={{ color: "#2c3e50", marginBottom: "15px" }}>
            {selectedTime.country_code}
          </h2>
          <p
            style={{ color: "#7f8c8d", fontSize: "14px", marginBottom: "10px" }}
          >
            {selectedTime.timezone}
          </p>
          <p
            style={{
              color: "#2c3e50",
              fontSize: "24px",
              fontWeight: "bold",
              margin: "0",
            }}
          >
            {formatTime(selectedTime.datetime)}
          </p>
        </div>
      )}
    </div>
  );
};

export default WorldTimes;
