import { useEffect, useRef, useState } from 'react';
import MovieCard from './MovieCard';
import { useQuery } from '@tanstack/react-query';
import { fetchDataFromApi } from '@/services/moviesService';
import Spinner from '@/components/Spinner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Search from './Search';
import axios from 'axios';

const Movies = () => {
    // https://www.omdbapi.com/?t=xxx&apikey=e4073753
    const [query, setQuery] = useState('');
    const serachBtnRef = useRef<any>(null);
    const [endpoint, setEndpoint] = useState('day');
    const [page, setPage] = useState(1);
    const [searchLoading, setSearchLoading] = useState(false);
    const [dataSearch, setDataSearch] = useState([]);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        serachBtnRef.current.click();
        setSearchLoading(true);
        const response = await axios(`https://www.omdbapi.com/?t=${query}&apikey=e4073753`);
        setSearchLoading(false);
        console.log(response.data);
        setDataSearch(response.data);
    };

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
            <Search loading={searchLoading} data={dataSearch} serachBtnRef={serachBtnRef} />
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
