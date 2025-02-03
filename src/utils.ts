export function getColorClassForPowerSupply(value: number): string {
  if (value < 130) {
    return "text-green-500";
  } else if (value >= 300 && value < 500) {
    return "text-blue-500";
  } else if (value > 700) {
    return "text-red-500";
  } else {
    return ""; // Default case (no color class)
  }
}
