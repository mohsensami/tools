const Search = () => {
    return (
        <div className="max-w-sm mx-auto bg-white rounded-2xl shadow-md overflow-hidden">
            <img
                className="w-full h-64 object-cover"
                src="https://m.media-amazon.com/images/M/MV5BNjY0MTc4ZDEtY2MxYi00ODIxLWJlNzQtZTlmZDVkYTYwM2NhXkEyXkFqcGc@._V1_SX300.jpg"
                alt="xXx Poster"
            />
            <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">xXx (2002)</h2>
                <p className="text-gray-600 text-sm mb-4">
                    <span className="font-semibold">Director:</span> Rob Cohen
                </p>
                <p className="text-gray-600 text-sm mb-4">
                    <span className="font-semibold">Genre:</span> Action, Adventure, Drama
                </p>
                <p className="text-gray-700 text-sm mb-4">
                    The US government recruits extreme sports athlete Xander Cage to infiltrate a Russian criminal ring,
                    which is plotting the destruction of the world.
                </p>
                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <span>
                        <span className="font-semibold">Runtime:</span> 124 min
                    </span>
                    <span>
                        <span className="font-semibold">Rated:</span> PG-13
                    </span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>
                        <span className="font-semibold">IMDb:</span> 5.8/10
                    </span>
                    <span>
                        <span className="font-semibold">Box Office:</span> $142M
                    </span>
                </div>
                <div className="mt-4">
                    <p className="text-gray-500 text-xs italic">Awards: 4 wins & 14 nominations total</p>
                </div>
                <div className="mt-6">
                    <button className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition">
                        Learn More
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Search;
