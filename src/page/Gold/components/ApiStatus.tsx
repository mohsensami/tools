import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

interface ApiStatusProps {
  isUsingDefaults: boolean;
  onManualInput?: () => void;
}

const ApiStatus = ({ isUsingDefaults, onManualInput }: ApiStatusProps) => {
  if (!isUsingDefaults) return null;

  return (
    <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-1">
              هشدار: استفاده از مقادیر پیش‌فرض
            </p>
            <p className="text-xs text-yellow-700 dark:text-yellow-300">
              امکان دریافت قیمت‌های لحظه‌ای از API در دسترس نیست. در حال استفاده از
              مقادیر پیش‌فرض هستیم. لطفاً قیمت‌های واقعی را به صورت دستی وارد کنید.
            </p>
            {onManualInput && (
              <button
                onClick={onManualInput}
                className="mt-2 text-xs text-yellow-800 dark:text-yellow-200 underline hover:no-underline"
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

