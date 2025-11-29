import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatPrice } from "@/services/goldService";

interface GoldPriceInputProps {
  value: number;
  onChange: (value: number) => void;
  label?: string;
  placeholder?: string;
}

const GoldPriceInput = ({
  value,
  onChange,
  label = "قیمت طلای ۱۸ عیار در بازار ایران",
  placeholder = "مثال: 4800000",
}: GoldPriceInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(/,/g, "");
    const numValue = parseInt(inputValue) || 0;
    onChange(numValue);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">ورود قیمت بازار</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="market-price">{label}</Label>
          <Input
            id="market-price"
            type="text"
            value={value > 0 ? formatPrice(value) : ""}
            onChange={handleChange}
            placeholder={placeholder}
            className="text-lg font-semibold"
            dir="ltr"
          />
          <p className="text-xs text-muted-foreground">
            قیمت هر گرم طلای ۱۸ عیار را به تومان وارد کنید
          </p>
        </div>
        {value > 0 && (
          <div className="bg-muted rounded-lg p-3">
            <p className="text-sm text-muted-foreground">
              قیمت وارد شده: <strong>{formatPrice(value)}</strong> تومان
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GoldPriceInput;
