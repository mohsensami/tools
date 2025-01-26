import { useEffect, useRef, useState } from 'react';
import MovieCard from './MovieCard';
import { useQuery } from '@tanstack/react-query';
import { fetchDataFromApi } from '@/services/moviesService';
import Spinner from '@/components/Spinner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

const Movies = () => {
    // https://www.omdbapi.com/?t=xxx&apikey=e4073753
    const [query, setQuery] = useState('');
    const serachBtnRef = useRef(null);
    const [endpoint, setEndpoint] = useState('day');
    const [page, setPage] = useState(1);

    const handleSubmit = (e: any) => {
        e.preventDefault();
        serachBtnRef.current.click();
        console.log('submit:', query);
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
            <Dialog>
                <DialogTrigger asChild>
                    <Button ref={serachBtnRef} variant="outline">
                        Share
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Share link</DialogTitle>
                        <DialogDescription>Anyone who has this link will be able to view this.</DialogDescription>
                    </DialogHeader>
                    <div className="flex items-center space-x-2">
                        <div className="grid flex-1 gap-2">
                            <Input id="link" defaultValue="https://ui.shadcn.com/docs/installation" readOnly />
                        </div>
                        <Button type="submit" size="sm" className="px-3">
                            <span className="sr-only">Copy</span>
                        </Button>
                    </div>
                    <DialogFooter className="sm:justify-start">
                        <DialogClose asChild>
                            <Button type="button" variant="secondary">
                                Close
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <h2 className="text-white text-xl">Trending Movies</h2>
            <form onSubmit={handleSubmit}>
                <div className="flex gap-1 lg:w-2/3 w-full mx-auto">
                    <Input value={query} onChange={(e) => setQuery(e.target.value)} />
                    <Button type="submit">Search</Button>
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
