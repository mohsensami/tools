import { useQuery } from "@tanstack/react-query";
import {
  fetchGoldPrice,
  fetchExchangeRate,
  calculateRealPrice18k,
} from "@/services/goldService";
import GoldPriceCard from "./GoldPriceCard";
import { RefreshCw, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface LivePricesProps {
  goldPrice?: number;
  exchangeRate?: number;
  isManual?: boolean;
}

const LivePrices = ({
  goldPrice,
  exchangeRate,
  isManual = false,
}: LivePricesProps) => {
  const {
    data: goldData,
    isLoading: goldLoading,
    refetch: refetchGold,
  } = useQuery({
    queryKey: ["gold-price"],
    queryFn: fetchGoldPrice,
    refetchInterval: 60000, // Refetch every minute
    staleTime: 30000, // Consider stale after 30 seconds
    enabled: !isManual, // Don't fetch if using manual values
  });

  const {
    data: exchangeData,
    isLoading: exchangeLoading,
    refetch: refetchExchange,
  } = useQuery({
    queryKey: ["exchange-rate"],
    queryFn: fetchExchangeRate,
    refetchInterval: 60000,
    staleTime: 30000,
    enabled: !isManual, // Don't fetch if using manual values
  });

  const effectiveGoldPrice = goldPrice || goldData?.price || 0;
  const effectiveExchangeRate = exchangeRate || exchangeData?.usdToIrr || 0;

  const realPrice18k =
    effectiveGoldPrice > 0 && effectiveExchangeRate > 0
      ? calculateRealPrice18k(effectiveGoldPrice, effectiveExchangeRate)
      : 0;

  const handleRefresh = () => {
    if (!isManual) {
      refetchGold();
      refetchExchange();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold">قیمت‌های لحظه‌ای</h2>
          {isManual && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Edit className="h-3 w-3" />
              دستی
            </Badge>
          )}
        </div>
        {!isManual && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={goldLoading || exchangeLoading}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${
                goldLoading || exchangeLoading ? "animate-spin" : ""
              }`}
            />
            بروزرسانی
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GoldPriceCard
          title="قیمت هر اونس طلا (دلار)"
          price={effectiveGoldPrice}
          unit="USD"
          isLoading={!isManual && goldLoading}
        />
        <GoldPriceCard
          title="نرخ دلار به تومان"
          price={effectiveExchangeRate}
          unit="تومان"
          isLoading={!isManual && exchangeLoading}
        />
        <GoldPriceCard
          title="قیمت واقعی طلای ۱۸ عیار"
          price={realPrice18k}
          unit="تومان/گرم"
          isLoading={!isManual && (goldLoading || exchangeLoading)}
        />
      </div>

      {!isManual && (goldLoading || exchangeLoading) && (
        <p className="text-sm text-muted-foreground text-center">
          در حال دریافت قیمت‌های لحظه‌ای...
        </p>
      )}
    </div>
  );
};

export default LivePrices;
