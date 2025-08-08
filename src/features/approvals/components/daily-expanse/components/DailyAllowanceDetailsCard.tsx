import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Detail } from "@/components/ui/detail";
import StatusBadge from "@/components/shared/common-status-badge";
import { format } from "date-fns";
import { DailyAllowanseDetailsProps } from "@/features/approvals/type/type";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import sampleReceipt from "@/assets/a320e87c6acd18eb34ccbfefbcddc062644af66a.png";

export function DailyAllowanceDetailsCard({
  dailyAllowances = [],
  expenseSubType,
}: DailyAllowanseDetailsProps) {
  if (!dailyAllowances.length) return null;

  return (
    <ScrollArea className="h-[calc(100vh-12rem)] pr-4 space-y-4">
      {dailyAllowances.map((allowance, i) => (
        <Card key={allowance.dailyAllowanceId} className="border shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-base">
              {expenseSubType === "daily_outstation"
                ? `Outstation Day ${i + 1}`
                : "Daily Allowance"}
              <StatusBadge status={allowance.status} />
            </CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="space-y-4 text-sm">
            {allowance.dailyAllowancesDetails?.map((detail) => {
              detail = {
                ...detail,
                receiptUrls: [sampleReceipt, sampleReceipt],
              };
              return (
                <div key={detail.id} className="border p-4 rounded-md mb-2">
                  <div className="grid grid-cols-2 gap-4">
                    <Detail
                      label="Date"
                      value={format(
                        new Date(detail.expensesDate),
                        "dd-MM-yyyy"
                      )}
                    />
                    <Detail label="Amount" value={`₹${detail.amount}`} />
                    <Detail
                      label="Category"
                      value={detail.expensesCategory?.categoryName || "-"}
                    />
                    <Detail label="Notes" value={detail.notes || "-"} />
                  </div>

                  <Separator className="mt-4 mb-2" />

                  <div className="flex flex-col items-center space-y-4 px-0 pt-2">
                    <div className="flex flex-wrap justify-center gap-4">
                      {(detail.receiptUrls || []).map((url, index) => (
                        <div
                          key={index}
                          className="flex flex-col items-center space-y-2"
                        >
                          <img
                            src={url}
                            alt={`Receipt ${index + 1}`}
                            className="w-40 h-40 rounded-md border shadow-sm object-cover bg-muted"
                          />
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" className="w-full">
                                View Full Size
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl p-0 bg-white rounded-md shadow-lg overflow-hidden">
                              <div className="flex justify-center items-center p-4">
                                <img
                                  src={url}
                                  alt={`Full Receipt ${index + 1}`}
                                  className="max-h-[80vh] max-w-full rounded-md object-contain mx-auto"
                                />
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      ))}
                    </div>

                    <Textarea placeholder="Add Comment (Optional)" />

                    <div className="grid w-full grid-cols-2 gap-2">
                      <Button className="bg-green-600 text-white hover:bg-green-700">
                        Approve Expense
                      </Button>
                      <Button variant="destructive">Reject Expense</Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      ))}
    </ScrollArea>
  );
}
