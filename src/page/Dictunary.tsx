import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const Dictunary = () => {
  const [query, setQuery] = useState("");

  const getDictionaryData = async () => {
    const { data } = await axios(
      `https://api.dictionaryapi.dev/api/v2/entries/en/hi`
    );
    return data;
  };

  const dictionaryResults = useQuery({
    queryKey: ["get-dictionary"],
    queryFn: getDictionaryData,
    // enabled: false,
    // staleTime: 600000,
  });
  useEffect(() => {
    console.log(dictionaryResults?.data);
  }, []);

  if (dictionaryResults.isLoading || dictionaryResults.isFetching) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
      </div>
    );
  }

  if (!dictionaryResults.data) {
    return <div className="text-center text-red-500">No data available.</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 lg:grid-cols-1">
      {dictionaryResults.data.map((entry: any, index: any) => (
        <Card
          key={index}
          className="p-4 shadow-lg rounded-2xl border border-gray-200"
        >
          <CardContent>
            <h2 className="text-xl font-bold capitalize mb-2">{entry.word}</h2>
            <div className="flex flex-col gap-4">
              {entry.phonetics.map((phonetic: any, idx: any) => (
                <div
                  key={idx}
                  className="flex flex-cols items-center gap-4 text-gray-600 text-sm"
                >
                  <span>{phonetic.text}</span>
                  {phonetic.audio && (
                    <audio controls className="h-6">
                      <source src={phonetic.audio} type="audio/mpeg" />
                    </audio>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-2">
              {entry.meanings.map((meaning: any, idx: any) => (
                <div key={idx} className="mb-3">
                  <h3 className="text-md font-semibold capitalize text-gray-700">
                    {meaning.partOfSpeech}
                  </h3>
                  {meaning.definitions.map((def: any, defIdx: any) => (
                    <p key={defIdx} className="text-gray-600 text-sm mb-1">
                      - {def.definition}
                    </p>
                  ))}
                </div>
              ))}
            </div>
            <div className="text-sm text-blue-500 underline mt-2">
              {entry.sourceUrls.map((url: any, urlIdx: any) => (
                <a
                  key={urlIdx}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  Source
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Dictunary;
