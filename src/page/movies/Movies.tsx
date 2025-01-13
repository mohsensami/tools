import { useEffect, useState } from 'react';
import MovieCard from './MovieCard';
import { useQuery } from '@tanstack/react-query';
import { fetchDataFromApi } from '@/services/moviesService';
import Spinner from '@/components/Spinner';

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
            <div>
                <select defaultValue={endpoint} onChange={(e) => setEndpoint(e.target.value)} name="" id="">
                    <option value="day">Day</option>
                    <option value="week">Week</option>
                </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
                {trendingMovies?.data.map((movie: any) => (
                    <MovieCard key={movie.id} data={movie} />
                ))}
            </div>
            <Pagination
                page={(value) => console.log(value)}
                totalPages={trendingMovies?.data.totalPages}
                onPageChange={() => trendingMovies.refetch()}
            />
        </div>
    );
};

export default Movies;

const Pagination = ({ page, totalPages, onPageChange }) => {
    const [currentPage, setCurrentPage] = useState(page);

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
            onPageChange(newPage);
        }
    };

    const renderPageNumbers = () => {
        const pages = [];
        const maxPageButtons = 5; // Max visible page buttons
        let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
        let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

        if (endPage - startPage + 1 < maxPageButtons) {
            startPage = Math.max(1, endPage - maxPageButtons + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`px-4 py-2 border rounded ${
                        i === currentPage ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                >
                    {i}
                </button>
            );
        }
        return pages;
    };

    return (
        <div className="flex items-center justify-center space-x-2 mt-6">
            {/* Previous Button */}
            <button
                onClick={() => handlePageChange(currentPage - 1)}
                className="px-4 py-2 border rounded bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                disabled={currentPage === 1}
            >
                Previous
            </button>

            {/* Page Numbers */}
            {renderPageNumbers()}

            {/* Next Button */}
            <button
                onClick={() => handlePageChange(currentPage + 1)}
                className="px-4 py-2 border rounded bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                disabled={currentPage === totalPages}
            >
                Next
            </button>
        </div>
    );
};
