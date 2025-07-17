import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { LatLngExpression } from "leaflet";

const center: LatLngExpression = [32.4279, 53.688];

const Map = () => {
  const [search, setSearch] = useState("");
  const [position, setPosition] = useState<LatLngExpression>(center);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          search
        )}`
      );
      const data = await res.json();
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        setPosition([lat, lon]);
      } else {
        setError("Location not found.");
      }
    } catch (err) {
      setError("Error searching location.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="bg-gray-400 flex justify-center py-2">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search location..."
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          >
            {loading ? "Searching..." : "Search"}
          </button>
          {error && (
            <span style={{ color: "red", marginLeft: 12 }}>{error}</span>
          )}
        </form>
      </div>
      <MapContainer
        center={position}
        zoom={6}
        style={{ height: "800px", width: "100%" }}
        key={position.toString()}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            {search ? search : "A pretty CSS3 popup. \nEasily customizable."}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default Map;
