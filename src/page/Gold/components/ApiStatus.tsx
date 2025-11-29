import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

interface ApiStatusProps {
  onManualInput?: () => void;
}

const ApiStatus = ({ onManualInput }: ApiStatusProps) => {
  // Always show warning since free APIs don't reflect Iranian market rates accurately
  return (
    <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-1">
              ⚠️ هشدار: برای دقت بیشتر، قیمت‌ها را دستی وارد کنید
            </p>
            <p className="text-xs text-yellow-700 dark:text-yellow-300 mb-2">
              APIهای رایگان نرخ <strong>رسمی</strong> دلار را نشان می‌دهند که با
              نرخ <strong>بازار آزاد ایران</strong> تفاوت زیادی دارد. برای
              محاسبه دقیق حباب طلا، لطفاً:
            </p>
            <ul className="text-xs text-yellow-700 dark:text-yellow-300 list-disc list-inside mb-2 space-y-1">
              <li>قیمت هر اونس طلا در بازار جهانی (دلار)</li>
              <li>نرخ دلار در بازار آزاد ایران (تومان)</li>
            </ul>
            {onManualInput && (
              <button
                onClick={onManualInput}
                className="mt-2 text-xs font-semibold text-yellow-900 dark:text-yellow-100 bg-yellow-200 dark:bg-yellow-800 px-3 py-1.5 rounded hover:bg-yellow-300 dark:hover:bg-yellow-700 transition-colors"
              >
                ورود دستی قیمت‌ها
              </button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiStatus;
