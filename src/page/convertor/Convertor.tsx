import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Convertor = () => {
  return (
    <div className="w-full p-4">
      <Tabs defaultValue="weight" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="weight">Weight</TabsTrigger>
          <TabsTrigger value="temperature">Temperature</TabsTrigger>
          <TabsTrigger value="currency">Currency</TabsTrigger>
        </TabsList>
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
