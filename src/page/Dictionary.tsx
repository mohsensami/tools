import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Loader2,
  Search,
  Volume2,
  BookOpen,
  Link as LinkIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Dictionary = () => {
  const [query, setQuery] = useState("");

  const getDictionaryData = async () => {
    const { data } = await axios(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${query}`
    );
    return data;
  };

  const dictionaryResults = useQuery({
    queryKey: ["get-dictionary", query],
    queryFn: getDictionaryData,
    enabled: false,
  });

  const handleSearch = (e: any) => {
    e.preventDefault();
    if (query.trim()) {
      dictionaryResults.refetch();
    }
  };

  if (dictionaryResults.isLoading || dictionaryResults.isFetching) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card className="p-6 shadow-lg rounded-2xl border border-gray-200 mb-6">
        <CardContent>
          <form onSubmit={handleSearch}>
            <div className="flex gap-2 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for a word..."
                  className="pl-10 py-6 text-lg"
                />
              </div>
              <Button
                type="submit"
                className="px-6 py-6 text-lg"
                disabled={
                  dictionaryResults.isLoading ||
                  dictionaryResults.isFetching ||
                  !query.trim()
                }
              >
                Search
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {dictionaryResults.error && (
        <Card className="p-6 shadow-lg rounded-2xl border border-red-200 bg-red-50">
          <CardContent>
            <p className="text-red-600 font-medium">
              Word not found. Please try another search.
            </p>
          </CardContent>
        </Card>
      )}

      {!dictionaryResults.data && !dictionaryResults.error && (
        <Card className="p-6 shadow-lg rounded-2xl border border-gray-200">
          <CardContent>
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">
                Enter a word to search for its definition, pronunciation, and
                more.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {dictionaryResults.data &&
        dictionaryResults.data.map((entry: any, index: any) => (
          <div key={index} className="space-y-6">
            <Card className="p-6 shadow-lg rounded-2xl border border-gray-200">
              <CardContent>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-3xl font-bold capitalize">
                      {entry.word}
                    </h2>
                    {entry.phonetic && (
                      <p className="text-gray-600 mt-1">{entry.phonetic}</p>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {entry.phonetics.map(
                      (phonetic: any, idx: any) =>
                        phonetic.audio && (
                          <div
                            key={idx}
                            className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-full"
                          >
                            <Volume2 className="h-4 w-4 text-blue-500" />
                            <audio controls className="h-6">
                              <source src={phonetic.audio} type="audio/mpeg" />
                            </audio>
                          </div>
                        )
                    )}
                  </div>
                </div>

                <Tabs defaultValue="0" className="w-full">
                  <TabsList className="mb-4">
                    {entry.meanings.map((meaning: any, idx: any) => (
                      <TabsTrigger key={idx} value={idx.toString()}>
                        {meaning.partOfSpeech}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {entry.meanings.map((meaning: any, idx: any) => (
                    <TabsContent key={idx} value={idx.toString()}>
                      <div className="space-y-4">
                        {meaning.definitions.map((def: any, defIdx: any) => (
                          <div
                            key={defIdx}
                            className="bg-gray-50 p-4 rounded-lg"
                          >
                            <p className="text-gray-800 mb-2">
                              <span className="font-medium text-blue-600">
                                {defIdx + 1}.
                              </span>{" "}
                              {def.definition}
                            </p>

                            {def.example && (
                              <p className="text-gray-600 italic text-sm mb-2">
                                "{def.example}"
                              </p>
                            )}

                            {def.synonyms && def.synonyms.length > 0 && (
                              <div className="mt-2">
                                <p className="text-sm text-gray-500 mb-1">
                                  Synonyms:
                                </p>
                                <div className="flex flex-wrap gap-1">
                                  {def.synonyms.map(
                                    (synonym: string, synIdx: number) => (
                                      <Badge
                                        key={synIdx}
                                        variant="outline"
                                        className="bg-blue-50 text-blue-700 border-blue-200"
                                      >
                                        {synonym}
                                      </Badge>
                                    )
                                  )}
                                </div>
                              </div>
                            )}

                            {def.antonyms && def.antonyms.length > 0 && (
                              <div className="mt-2">
                                <p className="text-sm text-gray-500 mb-1">
                                  Antonyms:
                                </p>
                                <div className="flex flex-wrap gap-1">
                                  {def.antonyms.map(
                                    (antonym: string, antIdx: number) => (
                                      <Badge
                                        key={antIdx}
                                        variant="outline"
                                        className="bg-red-50 text-red-700 border-red-200"
                                      >
                                        {antonym}
                                      </Badge>
                                    )
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}

                        {meaning.synonyms && meaning.synonyms.length > 0 && (
                          <div className="mt-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">
                              All Synonyms:
                            </h4>
                            <div className="flex flex-wrap gap-1">
                              {meaning.synonyms.map(
                                (synonym: string, synIdx: number) => (
                                  <Badge
                                    key={synIdx}
                                    variant="outline"
                                    className="bg-blue-50 text-blue-700 border-blue-200"
                                  >
                                    {synonym}
                                  </Badge>
                                )
                              )}
                            </div>
                          </div>
                        )}

                        {meaning.antonyms && meaning.antonyms.length > 0 && (
                          <div className="mt-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">
                              All Antonyms:
                            </h4>
                            <div className="flex flex-wrap gap-1">
                              {meaning.antonyms.map(
                                (antonym: string, antIdx: number) => (
                                  <Badge
                                    key={antIdx}
                                    variant="outline"
                                    className="bg-red-50 text-red-700 border-red-200"
                                  >
                                    {antonym}
                                  </Badge>
                                )
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>

            <Card className="p-6 shadow-lg rounded-2xl border border-gray-200">
              <CardContent>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <LinkIcon className="h-5 w-5 text-blue-500" />
                  Sources & License
                </h3>

                <div className="space-y-2">
                  {entry.sourceUrls.map((url: string, urlIdx: number) => (
                    <a
                      key={urlIdx}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-blue-600 hover:underline text-sm"
                    >
                      {url}
                    </a>
                  ))}

                  {entry.license && (
                    <div className="mt-4 text-sm text-gray-600">
                      <p>
                        License:{" "}
                        <a
                          href={entry.license.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {entry.license.name}
                        </a>
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
    </div>
  );
};

export default Dictionary;
