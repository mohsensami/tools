import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { LatLngExpression } from "leaflet";
import { Search, MapPin, Loader2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const center: LatLngExpression = [32.4279, 53.688];

// Helper component to fit bounds when selectedBounds changes
const FitBounds = ({ bounds }: { bounds: any }) => {
  const map = useMap();
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds);
    }
  }, [bounds, map]);
  return null;
};

const Map = () => {
  const [search, setSearch] = useState("");
  const [position, setPosition] = useState<LatLngExpression>(center);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<any[]>([]);
  const [selectedGeoJson, setSelectedGeoJson] = useState<any | null>(null);
  const [selectedBounds, setSelectedBounds] = useState<any | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
          `https://nominatim.openstreetmap.org/search?format=json&polygon_geojson=1&q=${encodeURIComponent(
            search
          )}`
        );
        const data = await res.json();
        setResults(data);
        setError(data.length === 0 ? "نتیجه‌ای یافت نشد." : null);
      } catch (err) {
        setError("خطا در جستجوی مکان.");
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
    // Parse boundingbox and geojson
    const bounds = item.boundingbox
      ? [
          [parseFloat(item.boundingbox[0]), parseFloat(item.boundingbox[2])],
          [parseFloat(item.boundingbox[1]), parseFloat(item.boundingbox[3])],
        ]
      : null;
    setSelectedBounds(bounds);
    setSelectedGeoJson(item.geojson || null);
    setPosition([parseFloat(item.lat), parseFloat(item.lon)]);
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
        `https://nominatim.openstreetmap.org/search?format=json&polygon_geojson=1&q=${encodeURIComponent(
          search
        )}`
      );
      const data = await res.json();
      if (data && data.length > 0) {
        const item = data[0];
        const bounds = item.boundingbox
          ? [
              [
                parseFloat(item.boundingbox[0]),
                parseFloat(item.boundingbox[2]),
              ],
              [
                parseFloat(item.boundingbox[1]),
                parseFloat(item.boundingbox[3]),
              ],
            ]
          : null;
        setSelectedBounds(bounds);
        setSelectedGeoJson(item.geojson || null);
        setPosition([parseFloat(item.lat), parseFloat(item.lon)]);
        setResults([]);
      } else {
        setError("مکان یافت نشد.");
      }
    } catch (err) {
      setError("خطا در جستجوی مکان.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      {/* Search Section */}
      <div className="relative bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border-b border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-2xl mx-auto">
            <div className="flex flex-col gap-3">
              {/* Search Form */}
              <form onSubmit={handleSearch} className="relative flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-500" />
                  <Input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="جستجوی مکان (مثال: تهران، ایران)"
                    dir="rtl"
                    className="pl-10 pr-10 h-12 text-base bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400 shadow-sm"
                  />
                  {search && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearch("");
                        setResults([]);
                        setError(null);
                      }}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="h-12 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      در حال جستجو...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      جستجو
                    </>
                  )}
                </Button>
              </form>

              {/* Error Message */}
              {error && (
                <div className="px-4 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm flex items-center gap-2">
                  <X className="h-4 w-4" />
                  {error}
                </div>
              )}

              {/* Results Dropdown */}
              {results.length > 0 && (
                <div className="relative z-50">
                  <div className="absolute z-50 top-0 left-0 right-0 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl max-h-96 overflow-hidden">
                    <div className="overflow-y-auto max-h-96 z-50">
                      {results.map((item) => (
                        <button
                          key={item.place_id}
                          type="button"
                          onClick={() => handleResultClick(item)}
                          className="w-full px-4 py-3 text-right hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors border-b border-slate-100 dark:border-slate-700 last:border-b-0 group"
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-0.5">
                              <MapPin className="h-5 w-5 text-blue-500 dark:text-blue-400 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                                {item.display_name}
                              </p>
                              {item.type && (
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                  {item.type}
                                </p>
                              )}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="z-10">
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
          {selectedGeoJson && <GeoJSON data={selectedGeoJson} />}
          {selectedBounds && <FitBounds bounds={selectedBounds} />}
        </MapContainer>
      </div>
    </div>
  );
};

export default Map;
