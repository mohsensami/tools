import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, Key } from "lucide-react";
import { Button } from "@/components/ui/button";

const ApiKeySetup = () => {
  return (
    <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-900 dark:text-green-100">
          <Key className="h-5 w-5" />
          APIهای رایگان استفاده شده
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-green-800 dark:text-green-200">
          این برنامه از APIهای <strong>کاملاً رایگان</strong> استفاده می‌کند و
          نیازی به ثبت‌نام یا API Key ندارد:
        </p>

        <div className="space-y-3">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-green-100 dark:border-green-800">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                nerkh.io
              </h3>
              <Button variant="outline" size="sm" asChild className="text-xs">
                <a
                  href="https://nerkh.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1"
                >
                  مشاهده
                  <ExternalLink className="h-3 w-3" />
                </a>
              </Button>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
              سرویس رایگان ایرانی - نرخ لحظه‌ای ارز، طلا و سکه
            </p>
            <ul className="text-xs text-gray-500 dark:text-gray-500 space-y-1">
              <li className="flex items-center gap-1">
                <span className="text-green-500">•</span> نرخ دلار بازار آزاد
              </li>
              <li className="flex items-center gap-1">
                <span className="text-green-500">•</span> قیمت طلای 18 عیار
              </li>
              <li className="flex items-center gap-1">
                <span className="text-green-500">•</span> قیمت اونس طلا
              </li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-green-100 dark:border-green-800">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                exchangerate-api.com
              </h3>
              <Button variant="outline" size="sm" asChild className="text-xs">
                <a
                  href="https://www.exchangerate-api.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1"
                >
                  مشاهده
                  <ExternalLink className="h-3 w-3" />
                </a>
              </Button>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
              API رایگان بین‌المللی - قیمت طلا و نرخ ارز
            </p>
            <ul className="text-xs text-gray-500 dark:text-gray-500 space-y-1">
              <li className="flex items-center gap-1">
                <span className="text-green-500">•</span> قیمت اونس طلا (USD)
              </li>
              <li className="flex items-center gap-1">
                <span className="text-green-500">•</span> نرخ ارزهای مختلف
              </li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-green-100 dark:border-green-800">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                metals.live
              </h3>
              <Button variant="outline" size="sm" asChild className="text-xs">
                <a
                  href="https://metals.live"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1"
                >
                  مشاهده
                  <ExternalLink className="h-3 w-3" />
                </a>
              </Button>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
              API رایگان - قیمت لحظه‌ای فلزات گرانبها
            </p>
            <ul className="text-xs text-gray-500 dark:text-gray-500 space-y-1">
              <li className="flex items-center gap-1">
                <span className="text-green-500">•</span> قیمت طلا (Spot Price)
              </li>
              <li className="flex items-center gap-1">
                <span className="text-green-500">•</span> داده‌های به‌روز
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-green-100 dark:bg-green-900/30 rounded-lg p-4 mt-4">
          <p className="text-sm font-semibold text-green-900 dark:text-green-100 mb-2">
            ✅ همه APIها رایگان هستند!
          </p>
          <p className="text-xs text-green-800 dark:text-green-200">
            این برنامه به صورت خودکار از APIهای رایگان استفاده می‌کند. نیازی به
            ثبت‌نام یا تنظیم API Key نیست. اگر API اول کار نکرد، به صورت خودکار
            به API بعدی متصل می‌شود.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiKeySetup;
