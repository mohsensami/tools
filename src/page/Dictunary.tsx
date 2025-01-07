const Dictunary = () => {
    return (
        <div>
            <div
                className="bg-gray-100 min-h-screen flex 
             flex-col justify-center items-center"
            >
                <div
                    className="max-w-md w-full p-8 bg-white rounded-lg 
                shadow-lg border-2 border-green-400"
                >
                    <h1 className="text-3xl font-semibold text-center mb-8">Dictionary App</h1>
                    <div className="mb-4">
                        <label
                            for="word-input"
                            className="block text-sm font-medium 
                          text-gray-700"
                        >
                            Enter a Word:
                        </label>
                        <input
                            type="text"
                            id="word-input"
                            className="w-full border border-gray-300 
                       rounded-md py-2 px-3 
                       focus:outline-none 
                       focus:border-blue-500"
                        />
                    </div>
                    <div id="definition" className="text-lg font-semibold mb-4"></div>
                    <button
                        id="search-btn"
                        className="px-6 py-3 bg-blue-500 text-white 
                   rounded-md hover:bg-blue-600 
                   focus:outline-none"
                    >
                        Search
                    </button>
                    <button
                        id="clear-btn"
                        className="px-6 py-3 ml-4 bg-red-500 
                       text-white rounded-md 
                       hover:bg-red-600 focus:outline-none"
                    >
                        Clear
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dictunary;
