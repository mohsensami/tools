import { useState } from "react";

const Lorem = () => {
  const [numParagraphs, setNumParagraphs] = useState(1);
  const [generatedText, setGeneratedText] = useState("");

  const loremIpsum = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
    "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores.",
    "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.",
    "Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur.",
    "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque.",
    "Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi.",
  ];

  const generateLorem = () => {
    const paragraphs = [];
    for (let i = 0; i < numParagraphs; i++) {
      paragraphs.push(loremIpsum[i % loremIpsum.length]);
    }
    setGeneratedText(paragraphs.join("\n\n"));
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Lorem Ipsum Generator
          </h1>
          <div className="flex flex-col items-center gap-4">
            <div className="w-full max-w-xs">
              <label
                htmlFor="paragraphs"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Number of Paragraphs
              </label>
              <select
                id="paragraphs"
                value={numParagraphs}
                onChange={(e) => setNumParagraphs(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={generateLorem}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Generate Lorem Ipsum
            </button>
          </div>
        </div>
        {generatedText && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="whitespace-pre-line text-gray-700">
              {generatedText}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Lorem;
