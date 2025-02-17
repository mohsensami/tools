import { fetchDataFromApi } from "@/services/moviesService";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const Movie = () => {
  const params = useParams();
  //   useEffect(() => {
  //     console.log(id);
  //   }, []);
  const getSingleMovie = async () => {
    const data = await fetchDataFromApi(`/movie/${params.id}`, "");
    return data;
  };
  const trendingMovies = useQuery({
    queryKey: ["single-movie", params.id],
    queryFn: getSingleMovie,
    staleTime: 600000,
  });

  const getSimilarMovies = async () => {
    const data = await fetchDataFromApi(`/movie/${params.id}/similar`, "");
    return data.results[0];
  };
  const similarMovies = useQuery({
    queryKey: ["similar-movies", params.id],
    queryFn: getSimilarMovies,
    staleTime: 600000,
  });

  useEffect(() => {
    trendingMovies.refetch();
    similarMovies.refetch();
  }, [params]);
  return (
    <div className="bg-gray-900 text-white">
      <div className="relative">
        <img
          src={`https://image.tmdb.org/t/p/original/${trendingMovies?.data?.backdrop_path}`}
          alt={trendingMovies?.data?.title}
          className="w-full h-64 object-cover"
        />
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative container mx-auto p-4">
          <h1 className="text-4xl font-bold">{trendingMovies?.data?.title}</h1>
          <h2 className="text-xl italic">{trendingMovies?.data?.tagline}</h2>
        </div>
      </div>
      <div className="container mx-auto p-4">
        <div className="flex flex-col md:flex-row">
          <img
            src={`https://image.tmdb.org/t/p/original${trendingMovies?.data?.poster_path}`}
            alt={trendingMovies?.data?.title}
            className="w-1/3 md:w-1/4 rounded-lg shadow-lg"
          />
          <div className="md:ml-4">
            <p className="mt-2">
              Release Date: {trendingMovies?.data?.release_date}
            </p>
            <p>Runtime: {trendingMovies?.data?.runtime} minutes</p>
            <p>Genres: {trendingMovies?.data?.genres.join(", ")}</p>
            <p>
              Rating: {trendingMovies?.data?.vote_average} (
              {trendingMovies?.data?.vote_count} votes)
            </p>
            <a
              href={trendingMovies?.data?.homepage}
              className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Visit Official Site
            </a>
          </div>
        </div>
        <h3 className="mt-4 text-2xl">Overview</h3>
        <p className="mt-2">{trendingMovies?.data?.overview}</p>
        <h3 className="mt-4 text-xl">Production Companies</h3>
        <div className="flex flex-wrap mt-2">
          {trendingMovies?.data?.production_companies.map((company, index) => (
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
      <div>
        <div className="bg-gray-900 text-white">
          <div className="relative">
            <img
              src={`https://image.tmdb.org/t/p/original/${similarMovies?.data?.backdrop_path}`}
              alt={similarMovies?.data?.title}
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="relative container mx-auto p-4">
              <h1 className="text-4xl font-bold">
                {similarMovies?.data?.title}
              </h1>
              <h2 className="text-xl italic">{similarMovies?.data?.tagline}</h2>
            </div>
          </div>
          <div className="container mx-auto p-4">
            <div className="flex flex-col md:flex-row">
              <img
                src={`https://image.tmdb.org/t/p/original${similarMovies?.data?.poster_path}`}
                alt={similarMovies?.data?.title}
                className="w-1/3 md:w-1/4 rounded-lg shadow-lg"
              />
              <div className="md:ml-4">
                <p className="mt-2">
                  Release Date: {similarMovies?.data?.release_date}
                </p>
                <p>Runtime: {similarMovies?.data?.runtime} minutes</p>
                {/* <p>Genres: {similarMovies?.data?.genres.join(", ")}</p> */}
                <p>
                  Rating: {similarMovies?.data?.vote_average} (
                  {similarMovies?.data?.vote_count} votes)
                </p>
                <a
                  href={similarMovies?.data?.homepage}
                  className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Visit Official Site
                </a>
              </div>
            </div>
            <h3 className="mt-4 text-2xl">Overview</h3>
            <p className="mt-2">{similarMovies?.data?.overview}</p>
            <h3 className="mt-4 text-xl">Production Companies</h3>
            <div className="flex flex-wrap mt-2">
              {/* {similarMovies?.data?.production_companies.map(
                (company, index) => (
                  <div key={index} className="flex items-center mr-4">
                    <img
                      src={`https://image.tmdb.org/t/p/w500${company.logo_path}`}
                      alt={company.name}
                      className="h-10 mr-2"
                    />
                    <span>{company.name}</span>
                  </div>
                )
              )} */}
            </div>
          </div>

          {/* Similar Movies Section */}
          <div className="container mx-auto p-4">
            <h3 className="mt-8 text-2xl">Similar Movies</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {/* {similarMovies?.data?.similarMovies.map((similarMovie, index) => (
                <div
                  key={index}
                  className="bg-gray-800 rounded-lg overflow-hidden shadow-lg"
                >
                  <img
                    src={`https://image.tmdb.org/t/p/w500${similarMovie.poster_path}`}
                    alt={similarMovie.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h4 className="text-lg font-bold">{similarMovie.title}</h4>
                    <p className="text-gray-400">{similarMovie.release_date}</p>
                    <p className="mt-2">{similarMovie.overview}</p>
                    <p className="mt-2">Rating: {similarMovie.vote_average}</p>
                  </div>
                </div>
              ))} */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Movie;
