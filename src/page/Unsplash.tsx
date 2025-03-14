import React, { useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const UNSPLASH_ACCESS_KEY = "YOUR_UNSPLASH_ACCESS_KEY"; // You'll need to replace this with your actual Unsplash API key

interface UnsplashImage {
  id: string;
  urls: {
    regular: string;
    small: string;
  };
  alt_description: string;
  user: {
    name: string;
  };
}

const Unsplash = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Debounce search query
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["unsplashImages", debouncedQuery],
    queryFn: async () => {
      const endpoint = debouncedQuery
        ? `https://api.unsplash.com/search/photos?query=${debouncedQuery}&per_page=20`
        : "https://api.unsplash.com/photos/random?count=20";

      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
      });

      return debouncedQuery ? response.data.results : response.data;
    },
    enabled: true,
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search for images..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {isLoading && (
        <div className="text-center">
          <p>Loading...</p>
        </div>
      )}

      {error && (
        <div className="text-center text-red-500">
          <p>Error loading images. Please try again.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.map((image: UnsplashImage) => (
          <div key={image.id} className="rounded-lg overflow-hidden shadow-lg">
            <img
              src={image.urls.small}
              alt={image.alt_description}
              className="w-full h-64 object-cover"
            />
            <div className="p-4">
              <p className="text-sm text-gray-600">
                Photo by {image.user.name}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Unsplash;
