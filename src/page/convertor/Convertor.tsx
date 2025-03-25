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
      // First, get the upload URL
      const uploadInitResponse = await fetch(
        "https://api.cloudconvert.com/v2/import/upload",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_CLOUD_CONVERT_API_KEY}`,
          },
        }
      );

      const uploadInit = await uploadInitResponse.json();
      const { form } = uploadInit.result;

      // Upload the file to S3
      const formData = new FormData();
      Object.entries(form.parameters).forEach(([key, value]) => {
        formData.append(key, value as string);
      });
      // Replace ${filename} placeholder with actual filename
      const keyWithFilename = form.parameters.key.replace('${filename}', selectedFile.name);
      formData.set('key', keyWithFilename);
      formData.append('file', selectedFile);

      const uploadResponse = await fetch(form.url, {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok && uploadResponse.status !== 201) {
        throw new Error("File upload failed");
      }

      // Wait a moment for the upload to be processed
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Create thumbnail task
      const thumbnailResponse = await fetch(
        "https://api.cloudconvert.com/v2/thumbnail",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_CLOUD_CONVERT_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            input: uploadInit.id,
            input_format: selectedFile.type.split("/")[1],
            output_format: "png",
            width: thumbnailSettings.width,
            height: thumbnailSettings.height,
            fit: "crop"
          }),
        }
      );

      const thumbnailResult = await thumbnailResponse.json();
      console.log('Thumbnail Result:', thumbnailResult); // For debugging

      // Continue with status polling...
      const taskId = thumbnailResult.data.id;

      // Poll for task completion
      let taskStatus = "processing";
      while (taskStatus === "processing" || taskStatus === "waiting") {
        await new Promise(resolve => setTimeout(resolve, 1000));

        const statusResponse = await fetch(
          `https://api.cloudconvert.com/v2/tasks/${taskId}`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_CLOUD_CONVERT_API_KEY}`,
            },
          }
        );

        const statusResult = await statusResponse.json();
        console.log('Status Result:', statusResult);
        taskStatus = statusResult.data.status;

        if (statusResult.data.status === "finished") {
          const downloadUrl = statusResult.data.result.files[0].url;
          // Download the image
          const imageResponse = await fetch(downloadUrl);
          const imageBlob = await imageResponse.blob();
          const imageUrl = URL.createObjectURL(imageBlob);
          setThumbnailUrl(imageUrl);
          break;
        }
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
