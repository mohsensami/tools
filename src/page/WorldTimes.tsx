import React, { useState, useEffect } from "react";
import axios from "axios";

interface TimeZone {
  timezone: string;
  datetime: string;
  country_code: string;
}

interface ZoneInfo {
  timezone: string;
  name: string;
}

const WorldTimes = () => {
  const [selectedTime, setSelectedTime] = useState<TimeZone | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedZone, setSelectedZone] = useState("Asia/Tehran");
  const [availableZones, setAvailableZones] = useState<ZoneInfo[]>([]);
  const [loadingZones, setLoadingZones] = useState(true);

  // Fetch all available time zones
  const fetchAvailableZones = async () => {
    setLoadingZones(true);
    try {
      const response = await axios.get(
        "https://timeapi.io/api/TimeZone/AvailableTimeZones"
      );

      if (response.data) {
        const zones = response.data.map((zone: string) => ({
          timezone: zone,
          name: zone.split("/").pop()?.replace("_", " ") || zone,
        }));

        zones.sort((a: ZoneInfo, b: ZoneInfo) => a.name.localeCompare(b.name));

        const iranIndex = zones.findIndex(
          (zone: ZoneInfo) => zone.timezone === "Asia/Tehran"
        );
        if (iranIndex !== -1) {
          const iranZone = zones.splice(iranIndex, 1)[0];
          zones.unshift(iranZone);
        }

        setAvailableZones(zones);
      }
    } catch (err) {
      console.error("Error fetching time zones:", err);
      setAvailableZones([
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
      ]);
    } finally {
      setLoadingZones(false);
    }
  };

  useEffect(() => {
    fetchAvailableZones();
  }, []);

  const fetchTime = async (zone: string) => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `https://timeapi.io/api/Time/current/zone?timeZone=${zone}`
      );
      const selectedZoneInfo = availableZones.find(
        (tz) => tz.timezone === zone
      );
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
    if (!loadingZones) {
      fetchTime(selectedZone);
      const interval = setInterval(() => fetchTime(selectedZone), 60000);
      return () => clearInterval(interval);
    }
  }, [selectedZone, loadingZones]);

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
    <div className="p-5 max-w-2xl mx-auto mt-10 bg-white rounded-2xl shadow-md">
      <h1 className="text-center mb-8 text-3xl text-gray-700">World Time</h1>

      <div className="mb-8 flex gap-3 items-center justify-center">
        <select
          value={selectedZone}
          onChange={handleZoneChange}
          disabled={loadingZones}
          className={`
            p-3 text-base rounded-lg border border-gray-300 w-64
            ${loadingZones ? "cursor-wait opacity-70" : "cursor-pointer"}
            focus:outline-none focus:ring-2 focus:ring-blue-500
          `}
        >
          {loadingZones ? (
            <option>Loading time zones...</option>
          ) : (
            availableZones.map((zone) => (
              <option key={zone.timezone} value={zone.timezone}>
                {zone.name}
              </option>
            ))
          )}
        </select>

        <button
          onClick={() => fetchTime(selectedZone)}
          disabled={loading || loadingZones}
          className={`
            px-5 py-3 rounded-lg text-white text-base transition-colors
            ${
              loading || loadingZones
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 cursor-pointer"
            }
          `}
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {(loading || loadingZones) && (
        <div className="text-center py-5">Loading time...</div>
      )}

      {error && (
        <div className="text-center p-5 text-red-600 bg-red-50 rounded-lg mb-5">
          {error}
        </div>
      )}

      {selectedTime && !loading && !loadingZones && !error && (
        <div className="text-center p-8 bg-gray-50 rounded-xl">
          <h2 className="text-gray-800 mb-4 text-2xl">
            {selectedTime.country_code}
          </h2>
          <p className="text-gray-500 text-sm mb-3">{selectedTime.timezone}</p>
          <p className="text-gray-800 text-2xl font-bold">
            {formatTime(selectedTime.datetime)}
          </p>
        </div>
      )}
    </div>
  );
};

export default WorldTimes;
