import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RotateCcw, RotateCw, Download, Upload } from "lucide-react";

const Paint: React.FC = () => {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [rotation, setRotation] = useState<number>(0);
  const [isBlackAndWhite, setIsBlackAndWhite] = useState<boolean>(false);
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(100);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImageUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleRotate = (direction: "left" | "right") => {
    setRotation((prev) => (direction === "left" ? prev - 90 : prev + 90));
  };

  const handleDownload = () => {
    if (canvasRef.current) {
      const link = document.createElement("a");
      link.download = "edited-image.png";
      link.href = canvasRef.current.toDataURL();
      link.click();
    }
  };

  const applyFilters = () => {
    if (canvasRef.current && imageUrl) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Apply rotation
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.translate(-canvas.width / 2, -canvas.height / 2);

        // Draw image
        ctx.drawImage(img, 0, 0);

        // Apply black and white if needed
        if (isBlackAndWhite) {
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          for (let i = 0; i < data.length; i += 4) {
            const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            data[i] = avg;
            data[i + 1] = avg;
            data[i + 2] = avg;
          }
          ctx.putImageData(imageData, 0, 0);
        }

        // Apply brightness and contrast
        ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;
        ctx.drawImage(img, 0, 0);

        ctx.restore();
      };
      img.src = imageUrl;
    }
  };

  React.useEffect(() => {
    applyFilters();
  }, [imageUrl, rotation, isBlackAndWhite, brightness, contrast]);

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Image Editor</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <Button
              variant="outline"
              className="gap-2"
              onClick={triggerFileInput}
            >
              <Upload className="h-4 w-4" />
              Upload Image
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {imageUrl && (
            <>
              <div className="flex justify-center bg-muted/50 p-4 rounded-lg">
                <canvas
                  ref={canvasRef}
                  className="max-w-full h-auto border rounded-md"
                />
              </div>

              <div className="flex flex-wrap gap-4 justify-center">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleRotate("left")}
                  className="h-10 w-10"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleRotate("right")}
                  className="h-10 w-10"
                >
                  <RotateCw className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsBlackAndWhite(!isBlackAndWhite)}
                >
                  {isBlackAndWhite ? "Color" : "Black & White"}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleDownload}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </div>

              <div className="space-y-6 px-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Brightness</label>
                  <Slider
                    value={[brightness]}
                    onValueChange={(value: number[]) => setBrightness(value[0])}
                    min={0}
                    max={200}
                    step={1}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Contrast</label>
                  <Slider
                    value={[contrast]}
                    onValueChange={(value: number[]) => setContrast(value[0])}
                    min={0}
                    max={200}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Paint;
