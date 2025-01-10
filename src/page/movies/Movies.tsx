import useFetch from '@/hooks/useFetch';
import { useEffect, useState } from 'react';
import MovieCard from './MovieCard';
import { useQuery } from '@tanstack/react-query';
import { fetchDataFromApi } from '@/services/moviesService';

const movies = [
    {
        backdrop_path: '/uKb22E0nlzr914bA9KyA5CVCOlV.jpg',
        id: 402431,
        title: 'Wicked',
        original_title: 'Wicked',
        overview:
            "In the land of Oz, ostracized and misunderstood green-skinned Elphaba is forced to share a room with the popular aristocrat Glinda at Shiz University, and the two's unlikely friendship is tested as they begin to fulfill their respective destinies as Glinda the Good and the Wicked Witch of the West.",
        poster_path: '/xDGbZ0JJ3mYaGKy4Nzd9Kph6M9L.jpg',
        media_type: 'movie',
        adult: false,
        original_language: 'en',
        genre_ids: [18, 10749, 14],
        popularity: 2260.092,
        release_date: '2024-11-20',
        video: false,
        vote_average: 7.308,
        vote_count: 1139,
    },
    {
        backdrop_path: '/ijZdQrdcHLogPkhUD73rPxV5HWx.jpg',
        id: 1023915,
        title: '2073',
        original_title: '2073',
        overview:
            "Inspired by Chris Marker's iconic 1962 featurette La Jetée; the year is 2073—a not-so-distant dystopian future—and the setting is New San Francisco, the scorched-earth tech-dominant police state where democracy and personal freedom have been well and truly obliterated.",
        poster_path: '/cenBMd8pVeAw2V5rkI7r92DCznr.jpg',
        media_type: 'movie',
        adult: false,
        original_language: 'en',
        genre_ids: [53, 99, 878],
        popularity: 27.794,
        release_date: '2024-12-27',
        video: false,
        vote_average: 6.9,
        vote_count: 8,
    },
];

const Movies = () => {
    const [endpoint, setEndpoint] = useState('day');

    // const { data, loading } = useFetch(`/trending/movie/${endpoint}`);

    const getTrendingMovies = async () => {
        const data = await fetchDataFromApi('/trending/movie/day', '');
        return data.results;
    };

    const trendingMovies = useQuery({ queryKey: ['trending-movies'], queryFn: getTrendingMovies, staleTime: 600000 });
    if (trendingMovies.isLoading || trendingMovies.isFetching) return 'Loading...';
    return (
        <div>
            <h2 className="text-white text-xl">Trending Movies</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
                {trendingMovies?.data.map((movie: any) => (
                    <MovieCard key={movie.id} data={movie} />
                ))}
            </div>
        </div>
    );
};

export default Movies;
