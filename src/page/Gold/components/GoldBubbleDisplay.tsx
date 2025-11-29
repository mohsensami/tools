import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/services/goldService";
import { AlertCircle, TrendingUp, TrendingDown } from "lucide-react";

interface GoldBubbleDisplayProps {
  bubble: number;
  bubblePercentage: number;
  marketPrice: number;
  realPrice: number;
  isLoading?: boolean;
}

const GoldBubbleDisplay = ({
  bubble,
  bubblePercentage,
  marketPrice,
  realPrice,
  isLoading = false,
}: GoldBubbleDisplayProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">محاسبه حباب طلا</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isPositiveBubble = bubble > 0;
  const bubbleColor = isPositiveBubble
    ? "text-red-600 dark:text-red-400"
    : "text-green-600 dark:text-green-400";

  const bubbleBgColor = isPositiveBubble
    ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
    : "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800";

  return (
    <Card className={`${bubbleBgColor} border-2`}>
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          محاسبه حباب طلای ۱۸ عیار
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Bubble Value */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-2">حباب طلا</p>
          <div className="flex items-center justify-center gap-2">
            {isPositiveBubble ? (
              <TrendingUp className="h-6 w-6 text-red-600 dark:text-red-400" />
            ) : (
              <TrendingDown className="h-6 w-6 text-green-600 dark:text-green-400" />
            )}
            <p className={`text-4xl font-bold ${bubbleColor}`}>
              {formatPrice(Math.abs(bubble))}
            </p>
            <span className="text-lg text-muted-foreground">تومان</span>
          </div>
          <Badge
            variant={isPositiveBubble ? "destructive" : "default"}
            className="mt-2 text-base px-3 py-1"
          >
            {isPositiveBubble ? "+" : ""}
            {bubblePercentage.toFixed(2)}%
          </Badge>
        </div>

        {/* Price Comparison */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div>
            <p className="text-sm text-muted-foreground mb-1">
              قیمت بازار ایران
            </p>
            <p className="text-xl font-semibold">
              {formatPrice(marketPrice)} تومان
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">
              قیمت واقعی (محاسبه شده)
            </p>
            <p className="text-xl font-semibold">
              {formatPrice(realPrice)} تومان
            </p>
          </div>
        </div>

        {/* Explanation */}
        <div className="bg-background/50 rounded-lg p-4 mt-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {isPositiveBubble ? (
              <>
                قیمت بازار ایران <strong>{formatPrice(bubble)}</strong> تومان
                بیشتر از قیمت واقعی محاسبه شده است. این نشان‌دهنده حباب مثبت در
                بازار است.
              </>
            ) : (
              <>
                قیمت بازار ایران{" "}
                <strong>{formatPrice(Math.abs(bubble))}</strong> تومان کمتر از
                قیمت واقعی محاسبه شده است. این نشان‌دهنده حباب منفی در بازار
                است.
              </>
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default GoldBubbleDisplay;
