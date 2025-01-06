const Movies = () => {
    return (
        <div>
            <div className="bg-gray-900 text-gray-100">
                <div className="container mx-auto px-4 py-6">
                    <h1 className="text-4xl font-bold text-center mb-8">Movie Database</h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                            <img
                                src="https://image.tmdb.org/t/p/w500/xDGbZ0JJ3mYaGKy4Nzd9Kph6M9L.jpg"
                                alt="Wicked"
                                className="w-full h-64 object-cover"
                            />
                            <div className="p-4">
                                <h2 className="text-xl font-bold truncate">Wicked</h2>
                                <p className="text-gray-400 text-sm mb-2">Release Date: 2024-11-20</p>
                                <p className="text-gray-400 text-sm mb-2">Rating: 7.4</p>
                                <p className="text-sm truncate">
                                    In the land of Oz, ostracized and misunderstood green-skinned Elphaba...
                                </p>
                                <a href="#" className="mt-3 inline-block text-blue-400 hover:underline">
                                    Read More
                                </a>
                            </div>
                        </div>

                        <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                            <img
                                src="https://image.tmdb.org/t/p/w500/6BxK38ehxuX2dJmZIMpJcVNbYks.jpg"
                                alt="Wallace & Gromit: Vengeance Most Fowl"
                                className="w-full h-64 object-cover"
                            />
                            <div className="p-4">
                                <h2 className="text-xl font-bold truncate">Wallace & Gromit: Vengeance Most Fowl</h2>
                                <p className="text-gray-400 text-sm mb-2">Release Date: 2024-12-18</p>
                                <p className="text-gray-400 text-sm mb-2">Rating: 7.7</p>
                                <p className="text-sm truncate">
                                    Gromit’s concern that Wallace is becoming too dependent on his inventions...
                                </p>
                                <a href="#" className="mt-3 inline-block text-blue-400 hover:underline">
                                    Read More
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Movies;
