import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatPrice } from "@/services/goldService";
import { X, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ManualInputsProps {
  goldPrice: number;
  exchangeRate: number;
  onGoldPriceChange: (value: number) => void;
  onExchangeRateChange: (value: number) => void;
  onClose: () => void;
}

const ManualInputs = ({
  goldPrice,
  exchangeRate,
  onGoldPriceChange,
  onExchangeRateChange,
  onClose,
}: ManualInputsProps) => {
  const handleGoldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, "");
    const numValue = parseFloat(value) || 0;
    onGoldPriceChange(numValue);
  };

  const handleExchangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, "");
    const numValue = parseInt(value) || 0;
    onExchangeRateChange(numValue);
  };

  return (
    <Card className="border-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">ورود دستی قیمت‌ها</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="manual-gold">قیمت هر اونس طلا (دلار)</Label>
          <Input
            id="manual-gold"
            type="text"
            value={goldPrice > 0 ? goldPrice.toLocaleString() : ""}
            onChange={handleGoldChange}
            placeholder="مثال: 2650"
            dir="ltr"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="manual-exchange">
            نرخ دلار به تومان (بازار آزاد)
          </Label>
          <Input
            id="manual-exchange"
            type="text"
            value={exchangeRate > 0 ? formatPrice(exchangeRate) : ""}
            onChange={handleExchangeChange}
            placeholder="مثال: 117000"
            dir="ltr"
          />
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            می‌توانید قیمت‌های واقعی را از منابع معتبر وارد کنید.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              onGoldPriceChange(2650); // Current gold price ~$2650/oz
              onExchangeRateChange(117000); // Current market rate
            }}
            className="text-xs"
          >
            <Zap className="h-3 w-3 mr-1" />
            استفاده از مقادیر پیشنهادی
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ManualInputs;
