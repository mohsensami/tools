export default function MovieCard({ data }: any) {
    return (
        <div>
            <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white">
                <img
                    className="w-full h-64 object-cover"
                    src={`https://image.tmdb.org/t/p/w500${data?.poster_path}`}
                    alt={data?.title}
                />
                <div className="px-6 py-4">
                    <h2 className="font-bold text-xl mb-2">{data?.title}</h2>
                    <p className="text-gray-700 text-base">
                        {data?.overview.length > 100 ? data?.overview.substring(0, 100) + '...' : data?.overview}
                    </p>
                </div>
                <div className="px-6 pt-4 pb-2">
                    <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
                        {data?.release_date}
                    </span>
                    <span className="inline-block bg-green-200 rounded-full px-3 py-1 text-sm font-semibold text-green-700 mr-2">
                        Rating: {data?.vote_average}
                    </span>
                    <span className="inline-block bg-blue-200 rounded-full px-3 py-1 text-sm font-semibold text-blue-700">
                        Votes: {data?.vote_count}
                    </span>
                </div>
            </div>
        </div>
    );
}
