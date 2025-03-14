import React, { useState } from "react";
import axios, { AxiosError } from "axios";
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

interface ErrorResponse {
  errors?: string[];
  message?: string;
}

const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ErrorResponse>;

    if (axiosError.response?.status === 401) {
      return "Invalid API key. Please check your Unsplash API credentials.";
    }

    if (axiosError.response?.status === 403) {
      return "API rate limit exceeded. Please try again later.";
    }

    if (axiosError.response?.status === 404) {
      return "No images found. Please try a different search term.";
    }

    if (axiosError.response?.data?.errors) {
      return axiosError.response.data.errors.join(", ");
    }

    if (axiosError.response?.data?.message) {
      return axiosError.response.data.message;
    }

    if (axiosError.message) {
      return axiosError.message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred. Please try again.";
};

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

  const { data, isLoading, error, isError, refetch } = useQuery({
    queryKey: ["unsplashImages", debouncedQuery],
    queryFn: async () => {
      try {
        const endpoint = debouncedQuery
          ? `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
              debouncedQuery
            )}&per_page=20`
          : "https://api.unsplash.com/photos/random?count=20";

        const response = await axios.get(endpoint, {
          headers: {
            Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
          },
          timeout: 10000, // 10 second timeout
        });

        return debouncedQuery ? response.data.results : response.data;
      } catch (error) {
        throw error;
      }
    },
    enabled: true,
    retry: 2, // Retry failed requests up to 2 times
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000), // Exponential backoff
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
        <div className="text-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2">Loading images...</p>
        </div>
      )}

      {isError && (
        <div className="text-center bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600">{getErrorMessage(error)}</p>
          <button
            onClick={() => refetch()}
            className="mt-2 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {!isLoading && !isError && data?.length === 0 && (
        <div className="text-center p-4">
          <p className="text-gray-600">
            No images found. Please try a different search term.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.map((image: UnsplashImage) => (
          <div key={image.id} className="rounded-lg overflow-hidden shadow-lg">
            <img
              src={image.urls.small}
              alt={image.alt_description}
              className="w-full h-64 object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src =
                  "https://via.placeholder.com/400x300?text=Image+Not+Available";
              }}
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
