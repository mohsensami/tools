import { useEffect, useState } from 'react';
import MovieCard from './MovieCard';
import { useQuery } from '@tanstack/react-query';
import { fetchDataFromApi } from '@/services/moviesService';
import Spinner from '@/components/Spinner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Movies = () => {
    const [endpoint, setEndpoint] = useState('day');
    const [page, setPage] = useState(1);

    // const { data, loading } = useFetch(`/trending/movie/${endpoint}`);

    const getTrendingMovies = async () => {
        const data = await fetchDataFromApi(`/trending/movie/${endpoint}?page=${page}`, '');
        return data.results;
    };

    const trendingMovies = useQuery({
        queryKey: ['trending-movies', endpoint, page],
        queryFn: getTrendingMovies,
        staleTime: 600000,
    });
    useEffect(() => {
        trendingMovies.refetch();
    }, [endpoint]);
    if (trendingMovies.isLoading || trendingMovies.isFetching)
        return (
            <div className="flex items-center justify-center h-96">
                <Spinner />
            </div>
        );
    return (
        <div>
            <h2 className="text-white text-xl">Trending Movies</h2>
            <div className="flex gap-1 lg:w-2/3 w-full mx-auto">
                <Input />
                <Button>Search</Button>
            </div>
            <div>
                <select defaultValue={endpoint} onChange={(e) => setEndpoint(e.target.value)} name="" id="">
                    <option value="day">Day</option>
                    <option value="week">Week</option>
                </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5  gap-6 p-6">
                {trendingMovies?.data.map((movie: any) => (
                    <MovieCard key={movie.id} data={movie} />
                ))}
            </div>
        </div>
    );
};

export default Movies;
