import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { OrderType, StallInfo } from "@/types/stallInfo";
import { TrashIcon } from "@radix-ui/react-icons";
import { UUID } from "crypto";
import { useState } from "react";
import OrderDrawer from "./orderDrawer";

export default function Order({
  commodities,
  currentOrder,
  setCurrentOrder,
  handleOrder,
  stallId
}: {
  commodities: StallInfo["commodities"];
  currentOrder: { [key: UUID]: number };
  setCurrentOrder: React.Dispatch<
    React.SetStateAction<{ [key: UUID]: number }>
  >;
  handleOrder: (
    order: Omit<OrderType, "status" | "ticket">
  ) => Promise<OrderType & { id: UUID }>;
  stallId: string;
}) {
  const [receivedMoney, setReceivedMoney] = useState(0);

  const sum = Object.entries(currentOrder).reduce((sum, [key, value]) => {
    const price = commodities?.[key as UUID]?.price || 0;
    return sum + price * value;
  }, 0);
  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl">注文内容</h2>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setCurrentOrder({})}
        >
          <TrashIcon />
        </Button>
      </div>
      <div className="space-y-2">
        {Object.entries(currentOrder)
          .filter(([_, value]) => value)
          .map(([key, value]) => (
            <Card key={key}>
              <CardContent className="p-2">
                <div className="flex justify-between">
                  <p>
                    <span className="text-lg">
                      {commodities?.[key as UUID]?.name}
                    </span>
                    <span className="opacity-70"> × {value}</span>
                  </p>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                    onClick={() =>
                      setCurrentOrder(o => {
                        const newOrder = { ...o };
                        delete newOrder[key as UUID];
                        return newOrder;
                      })
                    }
                    data-testid="delete-order"
                  >
                    <TrashIcon />
                  </Button>
                </div>
                <p className="text-right opacity-80">
                  ¥{(commodities?.[key as UUID]?.price || 0) * value}
                </p>
              </CardContent>
            </Card>
          ))}
      </div>
      <div className="p-4">
        <p className="flex items-center justify-between">
          <span>計:</span>
          <span className="text-xl">¥{sum}</span>
        </p>
      </div>
      <OrderDrawer
        currentOrder={currentOrder}
        receivedMoney={receivedMoney}
        setReceivedMoney={setReceivedMoney}
        commodities={commodities}
        handleOrder={handleOrder}
        trigger={<Button className="w-full">注文する</Button>}
        stallId={stallId}
      />
    </>
  );
}
