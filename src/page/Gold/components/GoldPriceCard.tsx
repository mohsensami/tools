import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/services/goldService";
import { TrendingUp, TrendingDown } from "lucide-react";

interface GoldPriceCardProps {
  title: string;
  price: number;
  unit: string;
  trend?: "up" | "down" | "neutral";
  isLoading?: boolean;
}

const GoldPriceCard = ({
  title,
  price,
  unit,
  trend = "neutral",
  isLoading = false,
}: GoldPriceCardProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const trendColor =
    trend === "up"
      ? "text-green-600 dark:text-green-400"
      : trend === "down"
      ? "text-red-600 dark:text-red-400"
      : "text-gray-600 dark:text-gray-400";

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-2xl font-bold ${trendColor}`}>
              {formatPrice(price)}
            </p>
            <p className="text-sm text-muted-foreground mt-1">{unit}</p>
          </div>
          {trend !== "neutral" && (
            <div className={trendColor}>
              {trend === "up" ? (
                <TrendingUp className="h-6 w-6" />
              ) : (
                <TrendingDown className="h-6 w-6" />
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GoldPriceCard;
