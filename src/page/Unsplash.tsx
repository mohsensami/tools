import { useState } from "react";
import axios, { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { Heart } from "lucide-react";

const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

if (!UNSPLASH_ACCESS_KEY) {
  throw new Error(
    "Unsplash Access Key is not defined in environment variables"
  );
}

interface UnsplashImage {
  id: string;
  urls: {
    regular: string;
    small: string;
    full: string;
    raw: string;
    thumb: string;
  };
  alt_description: string;
  user: {
    name: string;
    profile_image?: {
      small: string;
    };
  };
  likes: number;
  description?: string;
  width: number;
  height: number;
  location?: {
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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedImage, setSelectedImage] = useState<UnsplashImage | null>(
    null
  );

  const handleSearch = () => {
    setSearchTerm(searchQuery);
  };

  const { data, isLoading, error, isError, refetch } = useQuery({
    queryKey: ["unsplashImages", searchTerm],
    queryFn: async () => {
      try {
        const endpoint = searchTerm
          ? `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
              searchTerm
            )}&per_page=20`
          : "https://api.unsplash.com/photos/random?count=20";

        const response = await axios.get(endpoint, {
          headers: {
            Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
          },
          timeout: 10000, // 10 second timeout
        });

        return searchTerm ? response.data.results : response.data;
      } catch (error) {
        throw error;
      }
    },
    enabled: true,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });

  const handleDownload = (url: string, size: string) => {
    window.open(url, "_blank");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex gap-2">
        <input
          type="text"
          placeholder="Search for images..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Search
        </button>
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

      {searchTerm && (
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 bg-gray-400 p-4 rounded-lg">
          Search results for:{" "}
          <span className="text-blue-600">{searchTerm}</span>
        </h2>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
        {data?.map((image: UnsplashImage) => (
          <div
            key={image.id}
            className="relative rounded-lg overflow-hidden shadow-lg cursor-pointer transition-transform hover:scale-[1.02] bg-gray-800"
            onClick={() => setSelectedImage(image)}
          >
            <img
              src={image.urls.small}
              alt={image.alt_description || "Unsplash image"}
              className="w-full h-64 object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src =
                  "https://via.placeholder.com/400x300?text=Image+Not+Available";
              }}
            />
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  {image.user.profile_image?.small && (
                    <img
                      src={image.user.profile_image.small}
                      alt={image.user.name}
                      className="w-8 h-8 rounded-full mr-2"
                    />
                  )}
                  <p className="text-sm font-medium text-gray-200">
                    {image.user.name}
                  </p>
                </div>
                <div className="flex items-center text-red-500">
                  <Heart className="w-4 h-4 mr-1" />
                  <span className="text-sm">{image.likes}</span>
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-200 truncate">
                {image.alt_description || "Untitled"}
              </h3>
              {image.description && (
                <p className="text-sm text-gray-300 mt-1 line-clamp-2">
                  {image.description}
                </p>
              )}
              <div className="mt-3 flex justify-between items-center text-xs text-gray-400">
                <span>
                  {image.width} × {image.height}
                </span>
                {image.location?.name && (
                  <span className="truncate max-w-[150px]">
                    📍 {image.location.name}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 rounded-lg"
          onClick={() => setSelectedImage(null)}
        >
          <div className="bg-white bg-opacity-75 relative max-w-7xl max-h-[90vh] w-full">
            <button
              className="absolute top-4 right-4 text-black bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 z-10"
              onClick={() => setSelectedImage(null)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <img
              src={selectedImage.urls.regular}
              alt={selectedImage.alt_description}
              className="w-full h-auto max-h-[90vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <div
              className="absolute bottom-0 left-0 right-0 p-4 bg-white bg-opacity-90 rounded-b-lg flex flex-wrap gap-2 justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() =>
                  handleDownload(selectedImage.urls.thumb, "Thumbnail")
                }
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Download Thumbnail
              </button>
              <button
                onClick={() =>
                  handleDownload(selectedImage.urls.small, "Small")
                }
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Download Small
              </button>
              <button
                onClick={() =>
                  handleDownload(selectedImage.urls.regular, "Regular")
                }
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Download Regular
              </button>
              <button
                onClick={() => handleDownload(selectedImage.urls.full, "Full")}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Download Full
              </button>
              <button
                onClick={() => handleDownload(selectedImage.urls.raw, "Raw")}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Download Raw
              </button>
            </div>
            <div
              className="absolute text-black top-0 left-0 right-0 p-4 bg-white bg-opacity-50 rounded-t-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <p>Photo by {selectedImage.user.name}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Unsplash;
