import { useEffect, useRef, useState } from "react";
import MovieCard from "./MovieCard";
import { useQuery } from "@tanstack/react-query";
import { fetchDataFromApi } from "@/services/moviesService";
import Spinner from "@/components/Spinner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Search from "./Search";
import axios from "axios";

const Movies = () => {
  // https://www.omdbapi.com/?t=xxx&apikey=e4073753
  const [query, setQuery] = useState("");
  const serachBtnRef = useRef<any>(null);
  const [endpoint, setEndpoint] = useState("day");
  const [page, setPage] = useState(1);
  const [searchLoading, setSearchLoading] = useState(false);
  const [dataSearch, setDataSearch] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    serachBtnRef.current.click();
    setSearchLoading(true);
    const response = await axios(
      `https://www.omdbapi.com/?t=${query}&apikey=e4073753`
    );
    setSearchLoading(false);
    console.log(response.data);
    setDataSearch(response.data);
  };

  // const { data, loading } = useFetch(`/trending/movie/${endpoint}`);

  const getTrendingMovies = async () => {
    const data = await fetchDataFromApi(
      `/trending/movie/${endpoint}?page=${page}`,
      ""
    );
    setTotalPages(Math.min(data.total_pages, 500)); // TMDB API limits to 500 pages
    return data.results;
  };

  const trendingMovies = useQuery({
    queryKey: ["trending-movies", endpoint, page],
    queryFn: getTrendingMovies,
    staleTime: 600000,
  });

  useEffect(() => {
    trendingMovies.refetch();
  }, [endpoint, page]);

  if (trendingMovies.isLoading || trendingMovies.isFetching)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner />
      </div>
    );

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Search Section */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-white mb-6">Search Movies</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-3 lg:w-2/3 w-full">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for movies..."
                className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
              />
              <Button
                disabled={!query}
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6"
              >
                Search
              </Button>
            </div>
          </form>
        </div>

        {/* Trending Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Trending Movies</h2>
            <select
              defaultValue={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="day">Today</option>
              <option value="week">This Week</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {trendingMovies?.data.map((movie: any) => (
              <MovieCard key={movie.id} data={movie} />
            ))}
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center space-x-2 py-8">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 rounded-lg bg-gray-800 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors duration-200"
          >
            Previous
          </button>

          {[...Array(5)].map((_, index) => {
            let pageNumber;
            if (totalPages <= 5) {
              pageNumber = index + 1;
            } else if (page <= 3) {
              pageNumber = index + 1;
            } else if (page >= totalPages - 2) {
              pageNumber = totalPages - 4 + index;
            } else {
              pageNumber = page - 2 + index;
            }

            return (
              <button
                key={index}
                onClick={() => handlePageChange(pageNumber)}
                className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                  page === pageNumber
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 text-white hover:bg-gray-700"
                }`}
              >
                {pageNumber}
              </button>
            );
          })}

          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            className="px-4 py-2 rounded-lg bg-gray-800 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors duration-200"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Movies;
