import React, { useState, useEffect } from "react";
import axios from "axios";

interface TimeZone {
  timezone: string;
  datetime: string;
  country_code: string;
}

const WorldTimes = () => {
  const [timeZones, setTimeZones] = useState<TimeZone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Popular time zones to display
  const popularTimeZones = [
    "America/New_York",
    "Europe/London",
    "Asia/Tokyo",
    "Asia/Dubai",
    "Europe/Paris",
    "Asia/Shanghai",
    "Australia/Sydney",
    "Pacific/Auckland",
    "Asia/Singapore",
    "Europe/Berlin",
    "America/Los_Angeles",
    "Asia/Seoul",
  ];

  const fetchTimeZones = async () => {
    setLoading(true);
    setError("");
    try {
      const requests = popularTimeZones.map((zone) =>
        axios.get(`http://worldtimeapi.org/api/timezone/${zone}`)
      );
      const responses = await Promise.all(requests);
      const times = responses.map((res) => ({
        timezone: res.data.timezone,
        datetime: res.data.datetime,
        country_code: res.data.timezone.split("/")[1].replace("_", " "),
      }));
      setTimeZones(times);
    } catch (err) {
      setError("Failed to fetch time zones. Please try again later.");
      console.error("Error fetching time zones:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimeZones();
    // Refresh times every minute
    const interval = setInterval(fetchTimeZones, 60000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (datetime: string) => {
    return new Date(datetime).toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      month: "short",
      day: "numeric",
    });
  };

  const filteredTimeZones = timeZones.filter((tz) =>
    tz.country_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: "30px", color: "#333" }}>
        World Time Zones
      </h1>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search by city..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            fontSize: "16px",
            borderRadius: "8px",
            border: "1px solid #ddd",
          }}
        />
      </div>

      {loading && (
        <div style={{ textAlign: "center", padding: "20px" }}>
          Loading time zones...
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
          }}
        >
          {error}
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "20px",
          padding: "20px 0",
        }}
      >
        {filteredTimeZones.map((tz, index) => (
          <div
            key={index}
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: "20px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              transition: "transform 0.2s",
              cursor: "pointer",
              transform: searchTerm ? "translateY(-5px)" : "none",
            }}
          >
            <h3 style={{ margin: "0 0 10px 0", color: "#2c3e50" }}>
              {tz.country_code}
            </h3>
            <p style={{ margin: "0", color: "#7f8c8d", fontSize: "14px" }}>
              {tz.timezone}
            </p>
            <p
              style={{
                margin: "10px 0 0 0",
                color: "#2c3e50",
                fontSize: "18px",
                fontWeight: "bold",
              }}
            >
              {formatTime(tz.datetime)}
            </p>
          </div>
        ))}
      </div>

      <button
        onClick={fetchTimeZones}
        style={{
          display: "block",
          margin: "20px auto",
          padding: "10px 20px",
          backgroundColor: "#3498db",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "16px",
          transition: "background-color 0.2s",
        }}
      >
        Refresh Times
      </button>
    </div>
  );
};

export default WorldTimes;
