import { fetchDataFromApi } from "@/services/moviesService";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const Movie = () => {
  const params = useParams();
  //   useEffect(() => {
  //     console.log(id);
  //   }, []);
  const getTrendingMovies = async () => {
    const data = await fetchDataFromApi(
      `/trending/movie/${endpoint}?page=${page}`,
      ""
    );
    return data.results;
  };

  const trendingMovies = useQuery({
    queryKey: ["trending-movies", params.id],
    queryFn: getTrendingMovies,
    staleTime: 600000,
  });

  useEffect(() => {
    trendingMovies.refetch();
  }, [params]);
  return (
    <div className="bg-gray-900 text-white">
      <div className="relative">
        <img
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          alt={movie.title}
          className="w-full h-64 object-cover"
        />
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative container mx-auto p-4">
          <h1 className="text-4xl font-bold">{movie.title}</h1>
          <h2 className="text-xl italic">{movie.tagline}</h2>
        </div>
      </div>
      <div className="container mx-auto p-4">
        <div className="flex flex-col md:flex-row">
          <img
            src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
            alt={movie.title}
            className="w-1/3 md:w-1/4 rounded-lg shadow-lg"
          />
          <div className="md:ml-4">
            <p className="mt-2">Release Date: {movie.release_date}</p>
            <p>Runtime: {movie.runtime} minutes</p>
            <p>Genres: {movie.genres.join(", ")}</p>
            <p>
              Rating: {movie.vote_average} ({movie.vote_count} votes)
            </p>
            <a
              href={movie.homepage}
              className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Visit Official Site
            </a>
          </div>
        </div>
        <h3 className="mt-4 text-2xl">Overview</h3>
        <p className="mt-2">{movie.overview}</p>
        <h3 className="mt-4 text-xl">Production Companies</h3>
        <div className="flex flex-wrap mt-2">
          {movie.production_companies.map((company, index) => (
            <div key={index} className="flex items-center mr-4">
              <img
                src={`https://image.tmdb.org/t/p/w500${company.logo_path}`}
                alt={company.name}
                className="h-10 mr-2"
              />
              <span>{company.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Movie;
