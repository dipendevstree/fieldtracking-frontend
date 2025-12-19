import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { CheckCircle2, Settings } from "lucide-react";
import { useLeaveStore } from "../store/use-leave-store";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { z } from "zod";
import { LeaveRulesSchema } from "../data/schema";

export default function LeaveRulesConfiguration() {
  const { leaveRules, updateLeaveRules } = useLeaveStore();

  const form = useForm<z.infer<typeof LeaveRulesSchema>>({
    resolver: zodResolver(LeaveRulesSchema) as any,
    defaultValues: leaveRules,
  });

  const onSubmit = (data: z.infer<typeof LeaveRulesSchema>) => {
    updateLeaveRules(data);
    toast.success("Rules saved successfully");
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Sandwich Leave
            </CardTitle>
            <CheckCircle2
              className={`h-4 w-4 ${form.watch("sandwich.enabled") ? "text-green-600" : "text-gray-400"}`}
            />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {form.watch("sandwich.enabled") ? "Enabled" : "Disabled"}
            </div>
          </CardContent>
        </Card>
        {/* ... similar stats ... */}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Sandwich Leave Rule */}
          <Card className="border-blue-100">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-blue-600" /> Sandwich
                    Leave Rule
                  </CardTitle>
                  <CardDescription>
                    Count weekends/holidays between leaves
                  </CardDescription>
                </div>
                <FormField
                  control={form.control as any}
                  name="sandwich.enabled"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </CardHeader>
            {form.watch("sandwich.enabled") && (
              <CardContent className="space-y-4">
                <FormField
                  control={form.control as any}
                  name="sandwich.maxDays"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maximum Sandwich Days</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            )}
          </Card>

          {/* Carry Forward Rule */}
          <Card className="border-blue-100">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-blue-600" /> Carry Forward
                  </CardTitle>
                  <CardDescription>Roll over unused leaves</CardDescription>
                </div>
                <FormField
                  control={form.control as any}
                  name="carryForward.enabled"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </CardHeader>
            {form.watch("carryForward.enabled") && (
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-6">
                  <FormField
                    control={form.control as any}
                    name="carryForward.maxDays"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max Days</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control as any}
                    name="carryForward.expiryMonths"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expiry (Months)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            )}
          </Card>

          {/* Encashment Rule */}
          <Card className="border-blue-100">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-blue-600" /> Leave
                    Encashment
                  </CardTitle>
                  <CardDescription>
                    Allow employees to cash out unused leaves
                  </CardDescription>
                </div>
                <FormField
                  control={form.control as any}
                  name="encashment.enabled"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </CardHeader>
            {form.watch("encashment.enabled") && (
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-6">
                  <FormField
                    control={form.control as any}
                    name="encashment.maxDays"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max Encashable Days</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control as any}
                    name="encashment.minBalance"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Min Balance Required</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            )}
          </Card>

          <div className="flex gap-2">
            <Button type="submit">Save All Rules</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
