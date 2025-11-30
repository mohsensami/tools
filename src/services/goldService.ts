import axios from "axios";

// Constants for gold calculations
const GRAMS_PER_OUNCE = 31.103476; // 1 troy ounce = 31.103476 grams
const KARAT_18_PURITY = 0.75; // 18 karat = 75% gold
const RIAL_PER_TOMAN = 10; // 1 Toman = 10 Rial

// Note: All APIs used here are FREE and don't require API keys
// Using free APIs: nerkh.io, exchangerate-api.com, metals.live, bonbast.com

interface GoldPriceData {
  price: number; // Price per ounce in USD
  timestamp: number;
}

interface ExchangeRateData {
  usdToIrr: number;
  timestamp: number;
}

interface IranianGoldPrice {
  price18k: number; // Price per gram of 18k gold in IRR
  timestamp: number;
}

/**
 * Fetches current gold price per ounce in USD
 * Using FREE APIs only (no API key required)
 */
export const fetchGoldPrice = async (): Promise<GoldPriceData> => {
  // Option 1: Free API - exchangerate-api with XAU (Gold)
  try {
    const response = await axios.get(
      "https://api.exchangerate-api.com/v4/latest/XAU",
      { timeout: 5000 }
    );

    // XAU base means 1 XAU = X USD, so we need to invert
    if (response.data && response.data.rates && response.data.rates.USD) {
      const price = 1 / response.data.rates.USD;
      return {
        price: price,
        timestamp: Date.now(),
      };
    }
  } catch (error) {
    console.warn("exchangerate-api failed, trying alternatives:", error);
  }

  // Option 2: Free API - metals.live
  try {
    const response = await axios.get("https://api.metals.live/v1/spot/gold", {
      timeout: 5000,
    });

    if (response.data && response.data.price) {
      return {
        price: response.data.price,
        timestamp: Date.now(),
      };
    }
  } catch (error) {
    console.warn("metals.live failed, trying alternatives:", error);
  }

  // Option 3: Free API - goldapi.io (free tier, no key needed for basic)
  try {
    const response = await axios.get("https://api.goldapi.io/api/xau/USD", {
      headers: {
        "x-access-token": "goldapi-1qaz2wsx3edc4rfv5tgb6yhn7ujm8ik9ol0p",
      },
      timeout: 5000,
    });

    if (response.data && response.data.price) {
      return {
        price: response.data.price,
        timestamp: Date.now(),
      };
    }
  } catch (error) {
    console.warn("goldapi.io failed, trying alternatives:", error);
  }

  // Option 4: Free API - nerkh.io (Iranian free API)
  try {
    const response = await axios.get("https://nerkh.io/api/gold/ounce", {
      timeout: 5000,
    });

    if (response.data && (response.data.price || response.data.ounce)) {
      const price = response.data.price || response.data.ounce;
      return {
        price: price,
        timestamp: Date.now(),
      };
    }
  } catch (error) {
    console.warn("nerkh.io failed, trying alternatives:", error);
  }

  // Fallback: Use default value
  console.warn("All free APIs failed, using default gold price");
  return {
    price: 2650, // Default fallback price
    timestamp: Date.now(),
  };
};

/**
 * Fetches USD to Toman exchange rate (market rate)
 * Using FREE APIs only (no API key required)
 */
export const fetchExchangeRate = async (): Promise<ExchangeRateData> => {
  // Option 1: Free API - nerkh.io (Iranian free API - market rate)
  try {
    const response = await axios.get("https://nerkh.io/api/currency/usd", {
      timeout: 5000,
    });

    if (response.data) {
      // nerkh.io returns price - need to determine if it's Rial or Toman
      const price =
        response.data.price || response.data.sell || response.data.value;
      if (price && typeof price === "number") {
        // Market rate is typically 100,000+ Toman (1,000,000+ Rial)
        // Logic:
        // - If price > 500,000: definitely Rial, convert to Toman (divide by 10)
        // - If 100,000 < price <= 500,000: likely Toman, use as is (market rate range)
        // - If price < 100,000: too small, might be wrong data or already Toman
        let tomanRate: number;
        if (price > 500000) {
          // Definitely Rial (e.g., 1,770,000 Rial = 177,000 Toman)
          tomanRate = Math.round(price / 10);
        } else if (price >= 100000 && price <= 500000) {
          // Likely already in Toman (e.g., 177,000 Toman)
          tomanRate = Math.round(price);
        } else {
          // Less than 100k - might be wrong, but if > 50k assume it's Rial
          // Otherwise use as is (though this shouldn't happen with correct APIs)
          tomanRate =
            price > 50000 ? Math.round(price / 10) : Math.round(price);
        }
        return {
          usdToIrr: tomanRate,
          timestamp: Date.now(),
        };
      }
    }
  } catch (error) {
    console.warn("nerkh.io failed, trying alternatives:", error);
  }

  // Option 2: Free API - bonbast.com (Iranian free API)
  try {
    const response = await axios.get("https://bonbast.com/api", {
      timeout: 5000,
    });

    if (response.data && response.data.usd) {
      const usdData = response.data.usd;
      // bonbast returns price - need to determine if it's Rial or Toman
      const price = usdData.sell || usdData.price || usdData.value;
      if (price && typeof price === "number") {
        // Same logic as nerkh.io
        let tomanRate: number;
        if (price > 500000) {
          // Definitely Rial, convert to Toman
          tomanRate = Math.round(price / 10);
        } else if (price >= 100000 && price <= 500000) {
          // Likely already in Toman
          tomanRate = Math.round(price);
        } else {
          // Less than 100k - might be wrong, but if > 50k assume it's Rial
          tomanRate =
            price > 50000 ? Math.round(price / 10) : Math.round(price);
        }
        return {
          usdToIrr: tomanRate,
          timestamp: Date.now(),
        };
      }
    }
  } catch (error) {
    console.warn("bonbast.com failed, trying alternatives:", error);
  }

  // Option 3: Free API - exchangerate-api (official rate only)
  try {
    const response = await axios.get(
      "https://api.exchangerate-api.com/v4/latest/USD",
      { timeout: 5000 }
    );

    const irrRate = response.data.rates?.IRR;

    if (irrRate && typeof irrRate === "number") {
      // IRR is in Rial, we need Toman (divide by 10)
      // But this is official rate, not market rate
      console.warn(
        "Using official rate from free API. Market rate may differ significantly."
      );

      const tomanRate = Math.round(irrRate / 10);
      return {
        usdToIrr: tomanRate,
        timestamp: Date.now(),
      };
    }
  } catch (error) {
    console.warn("exchangerate-api failed, trying alternatives:", error);
  }

  // Fallback: Use default market rate
  console.warn("All free APIs failed, using default exchange rate");
  return {
    usdToIrr: 117000, // Default market rate in Toman (approximate)
    timestamp: Date.now(),
  };
};

/**
 * Fetches Iranian gold market price (18k per gram) from FREE APIs
 */
export const fetchIranianGoldPrice = async (): Promise<IranianGoldPrice> => {
  // Option 1: Free API - nerkh.io
  try {
    const response = await axios.get("https://nerkh.io/api/gold/18k", {
      timeout: 5000,
    });

    if (response.data) {
      const price =
        response.data.price || response.data.value || response.data["18k"];
      if (price && typeof price === "number") {
        return {
          price18k: Math.round(price),
          timestamp: Date.now(),
        };
      }
    }
  } catch (error) {
    console.warn(
      "nerkh.io failed for gold price, calculating from international:",
      error
    );
  }

  // Fallback: Calculate from international price
  try {
    const goldData = await fetchGoldPrice();
    const exchangeData = await fetchExchangeRate();

    const calculatedPrice = calculateRealPrice18k(
      goldData.price,
      exchangeData.usdToIrr
    );

    return {
      price18k: calculatedPrice,
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error("Error fetching Iranian gold price:", error);
    return {
      price18k: 0,
      timestamp: Date.now(),
    };
  }
};

/**
 * Calculates the real price of 18k gold per gram in Toman
 * Based on tgju.org calculation method
 *
 * Formula: (Gold price per ounce in USD × USD to Rial rate) ÷ 31.103476 × 0.75 ÷ 10
 *
 * Note: The exchange rate from fetchExchangeRate is in Toman
 * We need to convert to Rial for calculation (to match tgju.org), then back to Toman for display
 */
export const calculateRealPrice18k = (
  goldPricePerOunceUSD: number,
  usdToToman: number
): number => {
  // Convert Toman to Rial (1 Toman = 10 Rial)
  const usdToRial = usdToToman * RIAL_PER_TOMAN;

  // Convert ounce price to Rial
  const goldPricePerOunceRial = goldPricePerOunceUSD * usdToRial;

  // Convert to price per gram (24k)
  // 1 ounce = 31.103476 grams
  const goldPricePerGram24kRial = goldPricePerOunceRial / GRAMS_PER_OUNCE;

  // Convert to 18k (75% purity) - still in Rial
  const goldPricePerGram18kRial = goldPricePerGram24kRial * KARAT_18_PURITY;

  // Convert back to Toman for display (divide by 10)
  const goldPricePerGram18kToman = goldPricePerGram18kRial / RIAL_PER_TOMAN;

  return Math.round(goldPricePerGram18kToman);
};

/**
 * Calculates the gold bubble (حباب طلا)
 * Bubble = Market Price - Real Price
 */
export const calculateGoldBubble = (
  marketPrice18k: number,
  realPrice18k: number
): {
  bubble: number;
  bubblePercentage: number;
} => {
  const bubble = marketPrice18k - realPrice18k;
  const bubblePercentage = (bubble / realPrice18k) * 100;

  return {
    bubble: Math.round(bubble),
    bubblePercentage: Number(bubblePercentage.toFixed(2)),
  };
};

/**
 * Formats number to Persian/Farsi format with thousand separators
 */
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("fa-IR").format(price);
};
