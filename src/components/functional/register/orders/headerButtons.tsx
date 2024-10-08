import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { convertCsv } from "@/lib/convertCsv";
import { OrderType, StallInfo } from "@/types/stallInfo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@radix-ui/react-dropdown-menu";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { UUID } from "crypto";
import { OrderStatus } from ".";

export default function OrdersHeaderButtons({
  orderStatus,
  setOrderStatus,
  commodities,
  orders
}: {
  orderStatus: OrderStatus;
  setOrderStatus: any;
  commodities: StallInfo["commodities"];
  orders: { [key: UUID]: OrderType };
}) {
  function exportCsv() {
    const csv = convertCsv(commodities, orders || {});
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "orders.csv";
    a.click();
    URL.revokeObjectURL(url);
  }
  return (
    <div className="fixed right-0 flex">
      <Select value={orderStatus} onValueChange={(v: any) => setOrderStatus(v)}>
        <SelectTrigger className="w-36 bg-background">
          <SelectValue placeholder="絞り込み" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">すべて</SelectItem>
          <SelectItem value="pending">未完了</SelectItem>
          <SelectItem value="ready">準備完了(未受取)</SelectItem>
          <SelectItem value="completed">完了</SelectItem>
          <SelectItem value="cancelled">キャンセル</SelectItem>
        </SelectContent>
      </Select>
      <DropdownMenu>
        <DropdownMenuTrigger asChild aria-label="More options">
          <Button variant="ghost">
            <DotsVerticalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={exportCsv}>エクスポート</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
