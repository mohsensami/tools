import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { LatLngExpression } from "leaflet";

import L from "leaflet";
import markerShadow from "/public/images/marker-shadow.png";
import markerIcon from "/public/images/marker-icon.png";

const center: LatLngExpression = [32.4279, 53.688];

const Map = () => {
  const [search, setSearch] = useState("");
  const [position, setPosition] = useState<LatLngExpression>(center);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<any[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const customIcon = L.icon({
    iconUrl: markerIcon,
    //iconSize: [30, 40], // size of the icon
    //iconAnchor: [15, 40], // point of the icon which will correspond to marker's location
    //popupAnchor: [0, -40], // point from which the popup should open relative to the iconAnchor
    shadowUrl: markerShadow,
    // shadowSize: [41, 41],
    // shadowAnchor: [13, 41],
  });

  // Debounced search effect
  useEffect(() => {
    if (!search.trim()) {
      setResults([]);
      setError(null);
      return;
    }
    setLoading(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            search
          )}`
        );
        const data = await res.json();
        setResults(data);
        setError(data.length === 0 ? "No results found." : null);
      } catch (err) {
        setError("Error searching location.");
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 1000);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [search]);

  const handleResultClick = (item: any) => {
    const lat = parseFloat(item.lat);
    const lon = parseFloat(item.lon);
    setPosition([lat, lon]);
    setSearch(item.display_name);
    setResults([]);
    setError(null);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    // Immediate search on submit
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
        setResults([]);
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
      <div className="bg-gray-400 flex flex-col items-center py-2 relative">
        <form onSubmit={handleSearch} className="w-full flex justify-center ">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search location..."
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2 "
            style={{ maxWidth: 350 }}
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
        {results.length > 0 && (
          <ul
            style={{ zIndex: 9999999, position: "absolute" }}
            className="absolute top-12 z-40 bg-white border border-gray-300 rounded-lg mt-2 w-[350px] max-h-96 overflow-auto shadow-lg"
          >
            {results.map((item, idx) => (
              <li
                key={item.place_id}
                className="px-4 py-2 cursor-pointer hover:bg-blue-100"
                onClick={() => handleResultClick(item)}
              >
                {item.display_name}
              </li>
            ))}
          </ul>
        )}
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
        {search && (
          <Marker icon={customIcon} position={position}>
            <Popup>
              {search ? search : "A pretty CSS3 popup. \n Easily customizable."}
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default Map;
