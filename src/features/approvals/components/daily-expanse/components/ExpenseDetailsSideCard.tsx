import { format } from "date-fns";
import sampleReceipt from "@/assets/a320e87c6acd18eb34ccbfefbcddc062644af66a.png";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import StatusBadge from "@/components/shared/common-status-badge";
import { Detail } from "@/components/ui/detail";
import {
  TravelLumpSum,
  TravelExpanseDetailsProps,
  TravelRoute,
} from "@/features/approvals/type/type";

export function ExpenseDetailsSideCard({
  expenseSubType,
  travelLumpSums = [],
  travelRoutes = [],
}: TravelExpanseDetailsProps) {
  const isLumpSum = expenseSubType === "travel_lump_sum";
  const entries = isLumpSum ? travelLumpSums : travelRoutes;

  return (
    <ScrollArea className="h-[calc(100vh-12rem)] space-y-4 pr-4">
      {entries.map((item, idx) => (
        <Card key={idx} className="border shadow-sm mb-4">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-base">
              {isLumpSum ? "Lump Sum Travel" : `Travel Route ${idx + 1}`}
              <StatusBadge status={item.status} />
            </CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <Detail
                label="Date"
                value={format(new Date(item.date), "dd-MM-yyyy")}
              />
              <Detail
                label={isLumpSum ? "Mode" : "Vehicle"}
                value={
                  isLumpSum
                    ? (item as TravelLumpSum).mode
                    : (item as TravelRoute).vehicleCategory
                }
              />

              {!isLumpSum && (
                <>
                  <Detail
                    label="From"
                    value={(item as TravelRoute).fromLocation}
                  />
                  <Detail label="To" value={(item as TravelRoute).toLocation} />
                </>
              )}

              <Detail label="Amount" value={`₹${item.amount}`} />
              {"notes" in item && item.notes && (
                <Detail label="Notes" value={item.notes} />
              )}
            </div>

            <Separator />

            <div className="flex flex-col items-center space-y-4 pt-2">
              <img
                src={sampleReceipt || ""}
                alt="Receipt"
                className="h-auto w-40 rounded border"
              />

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">View Full Size</Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl p-0">
                  <img
                    src={sampleReceipt || ""}
                    alt="Full Receipt"
                    className="h-auto w-full rounded"
                  />
                </DialogContent>
              </Dialog>

              <Textarea placeholder="Add Comment (Optional)" />

              <div className="grid w-full grid-cols-2 gap-2">
                <Button className="bg-green-600 text-white hover:bg-green-700">
                  Approve Expense
                </Button>
                <Button variant="destructive">Reject Expense</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </ScrollArea>
  );
}
