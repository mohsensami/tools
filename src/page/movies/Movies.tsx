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
      <div className="flex items-center justify-center h-96">
        <Spinner />
      </div>
    );

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div>
      <Search
        loading={searchLoading}
        data={dataSearch}
        serachBtnRef={serachBtnRef}
      />
      <h2 className="text-white text-xl">Trending Movies</h2>
      <form onSubmit={handleSubmit}>
        <div className="flex gap-1 lg:w-2/3 w-full mx-auto">
          <Input value={query} onChange={(e) => setQuery(e.target.value)} />
          <Button disabled={!query} type="submit">
            Search
          </Button>
        </div>
      </form>
      <div>
        <select
          defaultValue={endpoint}
          onChange={(e) => setEndpoint(e.target.value)}
          name=""
          id=""
        >
          <option value="day">Day</option>
          <option value="week">Week</option>
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5  gap-6 p-6">
        {trendingMovies?.data.map((movie: any) => (
          <MovieCard key={movie.id} data={movie} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center space-x-2 py-4">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          className="px-3 py-1 rounded-md bg-gray-800 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700"
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
              className={`px-3 py-1 rounded-md ${
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
          className="px-3 py-1 rounded-md bg-gray-800 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Movies;
