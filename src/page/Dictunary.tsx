import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';

const Dictunary = () => {
    const [query, setQuery] = useState('');

    const getDictionaryData = async () => {
        const data = await axios(`https://api.dictionaryapi.dev/api/v2/entries/en/${query}`);
        return data;
    };

    const trendingMovies = useQuery({
        queryKey: ['get-dictionary'],
        queryFn: getDictionaryData,
        enabled: false,
        staleTime: 600000,
    });
    return (
        <div>
            <div
                className="bg-gray-100 min-h-screen flex 
             flex-col justify-center items-center"
            >
                <form>
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
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                        </div>
                        <div id="definition" className="text-lg font-semibold mb-4"></div>
                        <button
                            id="search-btn"
                            className="px-6 py-3 bg-blue-500 text-white 
                   rounded-md hover:bg-blue-600 
                   focus:outline-none"
                            type="submit"
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
                </form>
            </div>

            <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{trendingMovies.word}</h1>
                <div className="space-y-2">
                    {trendingMovies.phonetics.map((phonetic, index) => (
                        <div key={index} className="flex items-center space-x-2">
                            {phonetic.text && <span className="text-gray-700">{phonetic.text}</span>}
                            {phonetic.audio && (
                                <audio controls className="h-8">
                                    <source src={phonetic.audio} type="audio/mpeg" />
                                    Your browser does not support the audio element.
                                </audio>
                            )}
                        </div>
                    ))}
                </div>
                <div className="mt-4">
                    {trendingMovies.meanings.map((meaning, index) => (
                        <div key={index} className="mb-4">
                            <h2 className="text-xl font-semibold text-blue-600">{meaning.partOfSpeech}</h2>
                            <ul className="list-disc list-inside text-gray-800">
                                {meaning.definitions.map((definition, i) => (
                                    <li key={i} className="mt-1">
                                        {definition.definition}
                                        {definition.example && (
                                            <p className="text-gray-600 text-sm mt-1">
                                                Example: "{definition.example}"
                                            </p>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                <div className="mt-4 text-sm text-gray-500">
                    <p>
                        Source:{' '}
                        <a
                            href={trendingMovies.sourceUrls[0]}
                            className="text-blue-500 underline"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {trendingMovies.sourceUrls[0]}
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Dictunary;
