import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface CoinData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_24h: number;
}

const Crypto = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["crypto"],
    queryFn: async () => {
      const response = await axios.get(
        "https://api.coingecko.com/api/v3/coins/markets",
        {
          params: {
            vs_currency: "usd",
            order: "market_cap_desc",
            per_page: 10,
            page: 1,
            sparkline: false,
          },
        }
      );
      return response.data as CoinData[];
    },
  });

  if (isLoading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error loading data</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Top Cryptocurrencies</h1>
      <div className="grid gap-4">
        {data?.map((coin) => (
          <div
            key={coin.id}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
          >
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold">{coin.name}</h2>
                <p className="text-sm text-gray-500">
                  {coin.symbol.toUpperCase()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold">
                  ${coin.current_price.toLocaleString()}
                </p>
                <p
                  className={`text-sm ${
                    coin.price_change_percentage_24h >= 0
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {coin.price_change_percentage_24h.toFixed(2)}%
                </p>
              </div>
            </div>
            <div className="mt-2 text-sm text-gray-500">
              <p>Market Cap: ${coin.market_cap.toLocaleString()}</p>
              <p>Rank: #{coin.market_cap_rank}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Crypto;
