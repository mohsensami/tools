import React, { useState, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface ThumbnailSettings {
  width: number;
  height: number;
}

const Convertor = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [thumbnailSettings, setThumbnailSettings] = useState<ThumbnailSettings>(
    {
      width: 300,
      height: 200,
    }
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setThumbnailUrl(null); // Reset thumbnail when new file is selected
    }
  };

  const handleConvert = async () => {
    if (!selectedFile) return;

    setLoading(true);
    try {
      // First, upload the file to get the input ID
      const formData = new FormData();
      formData.append("file", selectedFile);

      const uploadResponse = await fetch(
        "https://api.cloudconvert.com/v2/import/upload",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${
              import.meta.env.VITE_CLOUD_CONVERT_API_KEY
            }`,
          },
        }
      );

      const uploadResult = await uploadResponse.json();
      const inputId = uploadResult.data.id;

      // Then create the thumbnail task
      const thumbnailResponse = await fetch(
        "https://api.cloudconvert.com/v2/thumbnail",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${
              import.meta.env.VITE_CLOUD_CONVERT_API_KEY
            }`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            input: inputId,
            input_format: selectedFile.type.split("/")[1],
            output_format: "png",
            width: thumbnailSettings.width,
            height: thumbnailSettings.height,
            fit: "crop",
          }),
        }
      );

      const thumbnailResult = await thumbnailResponse.json();

      // Wait for the task to complete and get the file URL
      const taskId = thumbnailResult.data.id;
      let taskStatus = "processing";

      while (taskStatus === "processing") {
        const statusResponse = await fetch(
          `https://api.cloudconvert.com/v2/tasks/${taskId}`,
          {
            headers: {
              Authorization: `Bearer ${
                import.meta.env.VITE_CLOUD_CONVERT_API_KEY
              }`,
            },
          }
        );
        const statusResult = await statusResponse.json();
        taskStatus = statusResult.data.status;

        if (taskStatus === "finished") {
          setThumbnailUrl(statusResult.data.result.files[0].url);
          break;
        } else if (taskStatus === "error") {
          throw new Error("Thumbnail conversion failed");
        }

        // Wait for 1 second before checking again
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error("Error creating thumbnail:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full p-4">
      <Tabs defaultValue="thumbnail" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="thumbnail">Thumbnail</TabsTrigger>
          <TabsTrigger value="weight">Weight</TabsTrigger>
          <TabsTrigger value="temperature">Temperature</TabsTrigger>
          <TabsTrigger value="currency">Currency</TabsTrigger>
        </TabsList>
        <TabsContent value="thumbnail" className="mt-6">
          <div className="rounded-lg border p-4 space-y-4">
            <h3 className="text-lg font-medium">Thumbnail Conversion</h3>

            <div className="space-y-4">
              <div>
                <Label htmlFor="file-input">Choose Image</Label>
                <Input
                  id="file-input"
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="width">Width (px)</Label>
                  <Input
                    id="width"
                    type="number"
                    value={thumbnailSettings.width}
                    onChange={(e) =>
                      setThumbnailSettings((prev) => ({
                        ...prev,
                        width: parseInt(e.target.value),
                      }))
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="height">Height (px)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={thumbnailSettings.height}
                    onChange={(e) =>
                      setThumbnailSettings((prev) => ({
                        ...prev,
                        height: parseInt(e.target.value),
                      }))
                    }
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Original Image</Label>
                  {previewUrl && (
                    <div className="mt-2 border rounded-lg overflow-hidden">
                      <img
                        src={previewUrl}
                        alt="Original"
                        className="max-w-full h-auto"
                      />
                    </div>
                  )}
                </div>
                <div>
                  <Label>Thumbnail Result</Label>
                  {thumbnailUrl ? (
                    <div className="mt-2 border rounded-lg overflow-hidden">
                      <img
                        src={thumbnailUrl}
                        alt="Thumbnail"
                        className="max-w-full h-auto"
                      />
                    </div>
                  ) : loading ? (
                    <div className="mt-2 border rounded-lg p-4 text-center">
                      Converting...
                    </div>
                  ) : (
                    <div className="mt-2 border rounded-lg p-4 text-center text-gray-500">
                      Thumbnail will appear here
                    </div>
                  )}
                </div>
              </div>

              <Button
                onClick={handleConvert}
                disabled={!selectedFile || loading}
                className="w-full"
              >
                {loading ? "Converting..." : "Convert to Thumbnail"}
              </Button>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="weight" className="mt-6">
          <div className="rounded-lg border p-4">
            <h3 className="text-lg font-medium">Weight Conversion</h3>
            {/* Weight conversion content will go here */}
          </div>
        </TabsContent>
        <TabsContent value="temperature" className="mt-6">
          <div className="rounded-lg border p-4">
            <h3 className="text-lg font-medium">Temperature Conversion</h3>
            {/* Temperature conversion content will go here */}
          </div>
        </TabsContent>
        <TabsContent value="currency" className="mt-6">
          <div className="rounded-lg border p-4">
            <h3 className="text-lg font-medium">Currency Conversion</h3>
            {/* Currency conversion content will go here */}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Convertor;
