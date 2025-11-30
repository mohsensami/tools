import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  fetchGoldPrice,
  fetchExchangeRate,
  calculateRealPrice18k,
  calculateGoldBubble,
} from "@/services/goldService";
import LivePrices from "./components/LivePrices";
import GoldPriceInput from "./components/GoldPriceInput";
import GoldBubbleDisplay from "./components/GoldBubbleDisplay";
import ApiStatus from "./components/ApiStatus";
import ManualInputs from "./components/ManualInputs";
import ApiKeySetup from "./components/ApiKeySetup";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Info, Settings } from "lucide-react";
import Spinner from "@/components/Spinner";

const Gold = () => {
  const [marketPrice, setMarketPrice] = useState<number>(0);
  const [manualGoldPrice, setManualGoldPrice] = useState<number>(0);
  const [manualExchangeRate, setManualExchangeRate] = useState<number>(0);
  const [showManualInputs, setShowManualInputs] = useState<boolean>(false);
  const [showApiSetup, setShowApiSetup] = useState<boolean>(false);

  const { data: goldData, isLoading: goldLoading } = useQuery({
    queryKey: ["gold-price"],
    queryFn: fetchGoldPrice,
    refetchInterval: 60000,
    staleTime: 30000,
  });

  const { data: exchangeData, isLoading: exchangeLoading } = useQuery({
    queryKey: ["exchange-rate"],
    queryFn: fetchExchangeRate,
    refetchInterval: 60000,
    staleTime: 30000,
  });

  // Use manual values if provided, otherwise use API data
  const effectiveGoldPrice =
    manualGoldPrice > 0 ? manualGoldPrice : goldData?.price || 0;
  const effectiveExchangeRate =
    manualExchangeRate > 0 ? manualExchangeRate : exchangeData?.usdToIrr || 0;

  const bubbleData = useMemo(() => {
    if (!effectiveGoldPrice || !effectiveExchangeRate || marketPrice <= 0) {
      return null;
    }

    const realPrice = calculateRealPrice18k(
      effectiveGoldPrice,
      effectiveExchangeRate
    );
    const bubble = calculateGoldBubble(marketPrice, realPrice);

    return {
      realPrice,
      ...bubble,
    };
  }, [effectiveGoldPrice, effectiveExchangeRate, marketPrice]);

  const isLoading = goldLoading || exchangeLoading;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            محاسبه‌گر حباب طلای ۱۸ عیار
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            محاسبه لحظه‌ای حباب طلا بر اساس قیمت‌های جهانی و نرخ ارز
          </p>
        </div>

        {/* Info Card */}
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
              <Info className="h-5 w-5" />
              راهنمای استفاده
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
              <p>
                <strong>حباب طلا</strong> تفاوت بین قیمت بازار ایران و قیمت
                واقعی محاسبه شده بر اساس قیمت جهانی طلا است.
              </p>
              <p>
                برای محاسبه حباب، ابتدا قیمت هر گرم طلای ۱۸ عیار در بازار ایران
                را وارد کنید.
              </p>
              <p className="text-xs mt-2 opacity-75">
                توجه: قیمت‌های لحظه‌ای هر ۶۰ ثانیه بروزرسانی می‌شوند.
              </p>
              <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-700">
                <p className="text-xs font-semibold mb-1 text-red-600 dark:text-red-400">
                  ⚠️ نکته بسیار مهم:
                </p>
                <p className="text-xs">
                  APIهای رایگان نرخ <strong>رسمی</strong> دلار را نشان می‌دهند
                  که با نرخ <strong>بازار آزاد ایران</strong> تفاوت زیادی دارد.
                  برای دقت بیشتر، لطفاً قیمت طلای جهانی و نرخ دلار بازار آزاد را
                  به صورت دستی وارد کنید.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* API Key Setup Guide */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">راهنمای تنظیمات</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowApiSetup(!showApiSetup)}
          >
            <Settings className="h-4 w-4 mr-2" />
            {showApiSetup ? "بستن راهنما" : "راهنمای API Key"}
          </Button>
        </div>
        {showApiSetup && <ApiKeySetup />}

        {/* API Status Warning - Always show since free APIs don't reflect market rates */}
        <ApiStatus onManualInput={() => setShowManualInputs(true)} />

        {/* Manual Inputs */}
        {showManualInputs && (
          <ManualInputs
            goldPrice={manualGoldPrice}
            exchangeRate={manualExchangeRate}
            onGoldPriceChange={setManualGoldPrice}
            onExchangeRateChange={setManualExchangeRate}
            onClose={() => setShowManualInputs(false)}
          />
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Spinner />
          </div>
        )}

        {/* Live Prices */}
        {!isLoading && (
          <LivePrices
            goldPrice={effectiveGoldPrice}
            exchangeRate={effectiveExchangeRate}
            isManual={manualGoldPrice > 0 || manualExchangeRate > 0}
          />
        )}

        {/* Market Price Input */}
        <GoldPriceInput value={marketPrice} onChange={setMarketPrice} />

        {/* Bubble Display */}
        {bubbleData && marketPrice > 0 && (
          <GoldBubbleDisplay
            bubble={bubbleData.bubble}
            bubblePercentage={bubbleData.bubblePercentage}
            marketPrice={marketPrice}
            realPrice={bubbleData.realPrice}
            isLoading={isLoading}
          />
        )}

        {/* Empty State */}
        {!isLoading && marketPrice === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                لطفاً قیمت طلای ۱۸ عیار در بازار ایران را وارد کنید تا حباب طلا
                محاسبه شود.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Additional Info */}
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-lg">نحوه محاسبه</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div>
                <strong className="text-foreground">
                  قیمت واقعی طلای ۱۸ عیار:
                </strong>
                <p className="mt-1">
                  (قیمت هر اونس طلا × نرخ دلار به ریال) ÷ ۳۱.۱۰۳۴۷۶ × ۰.۷۵ ÷ ۱۰
                </p>
                <p className="text-xs mt-1 text-muted-foreground">
                  توجه: نرخ دلار به تومان در محاسبه به ریال تبدیل می‌شود (×۱۰) و
                  نتیجه نهایی به تومان برگردانده می‌شود (÷۱۰)
                </p>
              </div>
              <div>
                <strong className="text-foreground">حباب طلا:</strong>
                <p className="mt-1">قیمت بازار ایران - قیمت واقعی محاسبه شده</p>
              </div>
              <div>
                <strong className="text-foreground">درصد حباب:</strong>
                <p className="mt-1">(حباب ÷ قیمت واقعی) × ۱۰۰</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Gold;
