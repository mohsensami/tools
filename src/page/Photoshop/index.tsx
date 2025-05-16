import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RotateCcw, RotateCw, Download, Upload, Crop } from "lucide-react";

const Paint: React.FC = () => {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [rotation, setRotation] = useState<number>(0);
  const [isBlackAndWhite, setIsBlackAndWhite] = useState<boolean>(false);
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(100);
  const [isCropping, setIsCropping] = useState<boolean>(false);
  const [cropStart, setCropStart] = useState<{ x: number; y: number } | null>(
    null
  );
  const [cropEnd, setCropEnd] = useState<{ x: number; y: number } | null>(null);
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

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isCropping) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCropStart({ x, y });
    setCropEnd({ x, y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isCropping || !cropStart) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCropEnd({ x, y });
    applyFilters();
  };

  const handleMouseUp = () => {
    if (!isCropping || !cropStart || !cropEnd) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const tempCanvas = document.createElement("canvas");
    const tempCtx = tempCanvas.getContext("2d");
    if (!tempCtx) return;

    const width = Math.abs(cropEnd.x - cropStart.x);
    const height = Math.abs(cropEnd.y - cropStart.y);

    tempCanvas.width = width;
    tempCanvas.height = height;

    const sourceX = Math.min(cropStart.x, cropEnd.x);
    const sourceY = Math.min(cropStart.y, cropEnd.y);

    tempCtx.drawImage(
      canvas,
      sourceX,
      sourceY,
      width,
      height,
      0,
      0,
      width,
      height
    );

    const croppedImageUrl = tempCanvas.toDataURL();
    setImageUrl(croppedImageUrl);
    setIsCropping(false);
    setCropStart(null);
    setCropEnd(null);
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

        // Draw crop selection if cropping
        if (isCropping && cropStart && cropEnd) {
          ctx.strokeStyle = "#00ff00";
          ctx.lineWidth = 2;
          const width = cropEnd.x - cropStart.x;
          const height = cropEnd.y - cropStart.y;
          ctx.strokeRect(cropStart.x, cropStart.y, width, height);
        }

        ctx.restore();
      };
      img.src = imageUrl;
    }
  };

  React.useEffect(() => {
    applyFilters();
  }, [imageUrl, rotation, isBlackAndWhite, brightness, contrast]);

  return (
    <div className="container mx-auto p-6 max-w-6xl min-h-screen bg-gray-50">
      <Card className="w-full shadow-xl">
        <CardHeader className="border-b bg-white/50">
          <CardTitle className="text-3xl font-bold text-gray-800">
            Image Editor
          </CardTitle>
          <p className="text-gray-500 mt-1">
            Edit and enhance your images with powerful tools
          </p>
        </CardHeader>
        <CardContent className="space-y-8 p-6">
          <div className="flex justify-center">
            <Button
              variant="default"
              size="lg"
              className="gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
              onClick={triggerFileInput}
            >
              <Upload className="h-5 w-5" />
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
              <div className="flex justify-center bg-gray-100 p-6 rounded-xl">
                <canvas
                  ref={canvasRef}
                  className="max-w-full h-auto border-2 border-gray-200 rounded-lg shadow-lg cursor-crosshair bg-white"
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                />
              </div>

              <div className="space-y-8">
                <div className="flex flex-wrap gap-3 justify-center">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleRotate("left")}
                    className="h-12 w-12 border-2 hover:bg-gray-100 transition-colors"
                  >
                    <RotateCcw className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleRotate("right")}
                    className="h-12 w-12 border-2 hover:bg-gray-100 transition-colors"
                  >
                    <RotateCw className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setIsBlackAndWhite(!isBlackAndWhite)}
                    className="border-2 hover:bg-gray-100 transition-colors"
                  >
                    {isBlackAndWhite ? "Color" : "Black & White"}
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setIsCropping(!isCropping)}
                    className="gap-2 border-2 hover:bg-gray-100 transition-colors"
                  >
                    <Crop className="h-5 w-5" />
                    {isCropping ? "Cancel Crop" : "Crop"}
                  </Button>
                  <Button
                    variant="default"
                    size="lg"
                    onClick={handleDownload}
                    className="gap-2 bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    <Download className="h-5 w-5" />
                    Download
                  </Button>
                </div>

                <div className="h-px bg-gray-200 my-8" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center justify-between">
                        Brightness
                        <span className="text-gray-500">{brightness}%</span>
                      </label>
                      <Slider
                        value={[brightness]}
                        onValueChange={(value: number[]) =>
                          setBrightness(value[0])
                        }
                        min={0}
                        max={200}
                        step={1}
                        className="w-full"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center justify-between">
                        Contrast
                        <span className="text-gray-500">{contrast}%</span>
                      </label>
                      <Slider
                        value={[contrast]}
                        onValueChange={(value: number[]) =>
                          setContrast(value[0])
                        }
                        min={0}
                        max={200}
                        step={1}
                        className="w-full"
                      />
                    </div>
                  </div>
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
