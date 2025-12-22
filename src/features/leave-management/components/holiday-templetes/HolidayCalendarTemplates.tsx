import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Calendar as CalendarIcon,
  MapPin,
  Users,
  Plus,
  Pencil,
  Trash2,
  CalendarDays,
  X,
} from "lucide-react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLeaveStore } from "../../store/use-leave-store";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { z } from "zod";
import { useState } from "react";
import { HolidayTemplate, HolidayTemplateSchema } from "../../data/schema";

type HolidayTemplateFormValues = z.infer<typeof HolidayTemplateSchema>;

export default function HolidayCalendarTemplates() {
  const {
    holidayTemplates,
    addHolidayTemplate,
    deleteHolidayTemplate,
    updateHolidayTemplate,
  } = useLeaveStore();
  const [editingId, setEditingId] = useState<string | null>(null);

  const form = useForm<HolidayTemplateFormValues>({
    resolver: zodResolver(HolidayTemplateSchema) as any,
    defaultValues: {
      name: "",
      region: "",
      description: "",
      holidays: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "holidays",
  });

  // State for new holiday input before adding to array (optional UX choice,
  // currently implementing direct append for simplicity or we can add empty row)
  const addEmptyHoliday = () => {
    append({
      name: "",
      date: new Date(),
      type: "National",
      id: crypto.randomUUID(),
    });
  };

  const onSubmit = (data: z.infer<typeof HolidayTemplateSchema>) => {
    if (editingId) {
      updateHolidayTemplate(editingId, data);
      setEditingId(null);
    } else {
      addHolidayTemplate({
        ...data,
        id: crypto.randomUUID(),
      } as HolidayTemplate);
    }
    form.reset({
      name: "",
      region: "",
      description: "",
      holidays: [],
    });
  };

  const handleEdit = (template: HolidayTemplate) => {
    setEditingId(template.id);
    form.reset({
      name: template.name,
      region: template.region,
      description: template.description || "",
      holidays: template.holidays.map((h) => ({
        ...h,
        date: new Date(h.date),
      })),
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    form.reset({
      name: "",
      region: "",
      description: "",
      holidays: [],
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Templates
            </CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {holidayTemplates.length} templates
            </div>
            <p className="text-xs text-muted-foreground">
              Active holiday calendars
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Assigned Employees
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">155</div>
            <p className="text-xs text-muted-foreground">
              Using custom calendars
            </p>
          </CardContent>
        </Card>
        {/* ... similar stats ... */}
      </div>

      {/* Create Template Form */}
      <Card className="border-blue-100 bg-blue-50/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {editingId ? (
              <Pencil className="h-4 w-4" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            {editingId
              ? "Edit Holiday Calendar Template"
              : "Create Holiday Calendar Template"}
          </CardTitle>
          <CardDescription>
            Define holidays for specific regions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control as any}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Template Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Gujarat Region" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control as any}
                  name="region"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Region / Category</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Gujarat" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control as any}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Description..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Holidays Field Array */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Holidays List</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addEmptyHoliday}
                  >
                    + Add Holiday
                  </Button>
                </div>
                <div className="space-y-2">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex gap-2 items-start">
                      <FormField
                        control={form.control as any}
                        name={`holidays.${index}.name`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input placeholder="Holiday Name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control as any}
                        name={`holidays.${index}.date`}
                        render={({ field }) => (
                          <FormItem className="flex-none w-[200px]">
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-full pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto p-0"
                                align="start"
                              >
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(index)}
                      >
                        <X className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit">
                  {editingId ? "Update Template" : "Save Template"}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Existing Templates List */}
      <div className="space-y-4">
        {holidayTemplates.map((template) => (
          <Card key={template.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="font-semibold flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-blue-600" />
                    {template.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {template.description}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="secondary" className="font-normal">
                      <MapPin className="h-3 w-3 mr-1" /> {template.region}
                    </Badge>
                    <Badge variant="secondary" className="font-normal">
                      <CalendarIcon className="h-3 w-3 mr-1" />{" "}
                      {template.holidays.length} holidays
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8"
                    onClick={() => handleEdit(template)}
                  >
                    <Pencil className="h-3 w-3 mr-2" /> Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => deleteHolidayTemplate(template.id)}
                  >
                    <Trash2 className="h-3 w-3 mr-2" /> Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
