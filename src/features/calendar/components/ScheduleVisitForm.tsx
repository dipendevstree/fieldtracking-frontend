import { useEffect, useState } from "react";
import {
  Controller,
  FormProvider,
  useForm,
  useFieldArray,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useSearch } from "@tanstack/react-router";
import { AlertCircle, MapPin, Trash2, Clock } from "lucide-react";
import moment from "moment-timezone";
import { useSelectOptions } from "@/hooks/use-select-option";
import { SearchableSelect } from "@/components/ui/SearchableSelect";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SimpleDatePicker } from "@/components/ui/datepicker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select as ShadSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Main } from "@/components/layout/main";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { useGetUsersForDropdown } from "@/features/buyers/services/users.hook";
import { formSchema, TFormSchema } from "../data/schema";
import {
  useCreateVisits,
  useUpdateVisits,
  useGetVisitByID,
  useGetAllCustomer,
  useGetAllVisit,
  useDeleteVisits,
} from "../services/calendar-view.hook";
import LocationPicker from "@/features/customers/components/LocationPicker";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  DeleteVisitDialogProps,
  MappedVisit,
  ScheduleVisitFormProps,
  Visit,
} from "../type/type";
import { TimePicker } from "@/components/ui/TimePicker";

function DeleteVisitDialog({ visit, isOpen, onClose }: DeleteVisitDialogProps) {
  if (!visit) return null;

  const { mutate: deleteVisit, isPending: isLoading } = useDeleteVisits(
    visit.id,
    onClose
  );

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the visit
            for <strong>{visit.purpose}</strong>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => deleteVisit()}
            disabled={isLoading}
            className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
          >
            {isLoading ? "Deleting..." : "Confirm Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function ScheduleVisitForm({ onClose }: ScheduleVisitFormProps) {
  const params = useParams({ strict: false });
  const visitId = params.id;
  const isEditMode = !!visitId;

  const { salesRepId }: any = useSearch({
    from: "/_authenticated/calendar/schedule-visit",
  });

  const isCreateWithPrefill = !isEditMode && salesRepId;

  const form = useForm<TFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      salesRep: "",
      visits: [
        {
          purpose: "",
          customer: "",
          time: "",
          location: "",
          address: "",
          city: "",
          state: "",
          zipCode: "",
          country: "",
          latitude: undefined,
          longitude: undefined,
          reportType: "",
          priority: "Medium",
          duration: "1",
          preparationNotes: "",
        },
      ],
    },
  });

  const {
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "visits",
  });

  // 1. Define the core fields that must be filled before adding a new visit.
  const requiredFieldsForNewVisit: (keyof TFormSchema["visits"][0])[] = [
    "purpose",
    "customer",
    "time",
    "address",
    "duration",
  ];

  // 2. Watch the values of the last item in the field array.
  const lastVisitIndex = fields.length - 1;
  const lastVisitValues = watch(`visits.${lastVisitIndex}`);

  // 3. Determine if the required fields are filled.
  const areRequiredFieldsFilled = lastVisitValues
    ? requiredFieldsForNewVisit.every((field) => {
        const value = lastVisitValues[field];
        // Ensure the value is not null, undefined, or an empty string.
        return (
          value !== null && value !== undefined && String(value).trim() !== ""
        );
      })
    : false; // If lastVisitValues is undefined, they are not filled.

  const selectedDate = watch("date");
  const selectedRep = watch("salesRep");

  const {
    data: visitData,
    isLoading: isVisitLoading,
    error: visitError,
  } = useGetVisitByID(visitId || "", isEditMode);

  const {
    data: visits,
    isLoading: isVisitsLoading,
    error: visitsError,
  } = useGetAllVisit({
    startDate: selectedDate,
    endDate: selectedDate,
    salesRepresentativeUserId: selectedRep,
  });

  const [visitToDelete, setVisitToDelete] = useState<MappedVisit | null>(null);

  const upcomingVisits: MappedVisit[] =
    visits?.map((visit: Visit) => ({
      id: visit.id || visit.visitId || "",
      rep:
        `${visit.salesRepresentativeUser.firstName} ${visit.salesRepresentativeUser.lastName}`.trim() ||
        "Unknown",
      salesRepId: visit.salesRepresentativeUser.id || "",
      roleId: visit.salesRepresentativeUser.roleId || "",
      customer:
        typeof visit.customer === "string"
          ? visit.customer
          : visit.customer?.companyName || "Unknown",
      contact: visit.contact || "N/A",
      date: new Date(visit.date).toISOString().split("T")[0],
      time: visit.time,
      purpose: visit.purpose,
      location: visit.location || "N/A",
      status:
        visit.status.charAt(0).toUpperCase() +
        visit.status.slice(1).toLowerCase(),
      priority: visit.priority,
      originalVisit: visit,
    })) || [];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      Confirmed: "bg-green-100 text-green-800",
      Pending: "bg-yellow-100 text-yellow-800",
      Cancelled: "bg-red-100 text-red-800",
      Completed: "bg-blue-100 text-blue-800",
      "In-progress": "bg-purple-100 text-purple-800",
    };
    return variants[status] || "bg-gray-100 text-gray-800";
  };

  const getPriorityBadge = (priority: string) => {
    const variants: Record<string, string> = {
      High: "bg-red-100 text-red-800",
      Medium: "bg-yellow-100 text-yellow-800",
      Low: "bg-green-100 text-green-800",
    };
    return variants[priority] || "bg-gray-100 text-gray-800";
  };

  useEffect(() => {
    if (isEditMode && visitData) {
      const formatDateForInput = (dateString: string) =>
        dateString ? moment(dateString).format("YYYY-MM-DD") : "";
      const formatTimeForInput = (timeString: string) =>
        timeString ? moment(timeString, "h:mm A").format("HH:mm") : "";

      const formData: TFormSchema = {
        date: formatDateForInput(visitData.date),
        salesRep: visitData.salesRepresentativeUser?.id || "",
        visits: [
          {
            purpose: visitData.purpose || "",
            customer: visitData.customerId || "",
            time: formatTimeForInput(visitData.time),
            location: visitData.location || visitData.streetAddress || "",
            address: visitData.streetAddress || "",
            city: visitData.city || "",
            state: visitData.state || "",
            zipCode: visitData.zipCode ? String(visitData.zipCode) : "",
            country: visitData.country || "",
            latitude: visitData.latitude || undefined,
            longitude: visitData.longitude || undefined,
            reportType: visitData.reportType || "",
            priority:
              visitData.priority &&
              ["Low", "Medium", "High"].includes(visitData.priority)
                ? visitData.priority
                : "Medium",
            duration: visitData.duration ? String(visitData.duration) : "1",
            preparationNotes: visitData.preparationNotes || "",
          },
        ],
      };
      reset(formData);
    } else if (isCreateWithPrefill) {
      reset({
        date: new Date().toISOString().split("T")[0],
        salesRep: salesRepId,
        visits: [
          {
            purpose: "",
            customer: "",
            time: "",
            location: "",
            address: "",
            city: "",
            state: "",
            zipCode: "",
            country: "",
            latitude: undefined,
            longitude: undefined,
            reportType: "",
            priority: "Medium",
            duration: "1",
            preparationNotes: "",
          },
        ],
      });
    } else if (!isEditMode) {
      reset({
        date: new Date().toISOString().split("T")[0],
        salesRep: "",
        visits: [
          {
            purpose: "",
            customer: "",
            time: "",
            location: "",
            address: "",
            city: "",
            state: "",
            zipCode: "",
            country: "",
            latitude: undefined,
            longitude: undefined,
            reportType: "",
            priority: "Medium",
            duration: "1",
            preparationNotes: "",
          },
        ],
      });
    }
  }, [visitData, isEditMode, reset, salesRepId]);

  const { data: customerList = [], isLoading: isCustomersLoading } =
    useGetAllCustomer();

  const customerOptions = customerList.map((customer: any) => ({
    value: customer.customerId,
    label: customer.companyName,
  }));

  const { data: userList = [], isLoading: isUsersLoading } =
    useGetUsersForDropdown({});

  const enhancedUserList = userList.map((user: any) => ({
    ...user,
    fullName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
  }));

  const users = useSelectOptions<any>({
    listData: enhancedUserList,
    labelKey: "fullName",
    valueKey: "id",
  }).map((option) => ({ ...option, value: String(option.value) }));

  const [locationStates, setLocationStates] = useState<
    {
      isCustomLocation: boolean;
      locationInputMode: "search" | "map";
      isMapModalOpen: boolean;
      latLng: string;
    }[]
  >(
    fields.map(() => ({
      isCustomLocation: false,
      locationInputMode: "map",
      isMapModalOpen: false,
      latLng: "",
    }))
  );

  useEffect(() => {
    setLocationStates(
      fields.map((_, index) => ({
        isCustomLocation: locationStates[index]?.isCustomLocation || false,
        locationInputMode: locationStates[index]?.locationInputMode || "map",
        isMapModalOpen: locationStates[index]?.isMapModalOpen || false,
        latLng: locationStates[index]?.latLng || "",
      }))
    );
  }, [fields.length]);

  const handleMapLocationSelect = (
    data: {
      lat: number;
      lng: number;
      address: string;
      city: string;
      state: string;
      country: string;
      postalCode: string;
    },
    index: number
  ) => {
    setValue(`visits.${index}.location`, data.address, {
      shouldValidate: true,
    });
    setValue(`visits.${index}.address`, data.address, { shouldValidate: true });
    setValue(`visits.${index}.city`, data.city, { shouldValidate: true });
    setValue(`visits.${index}.state`, data.state, { shouldValidate: true });
    setValue(`visits.${index}.zipCode`, data.postalCode, {
      shouldValidate: true,
    });
    setValue(`visits.${index}.country`, data.country, { shouldValidate: true });
    setValue(`visits.${index}.latitude`, data.lat, { shouldValidate: true });
    setValue(`visits.${index}.longitude`, data.lng, { shouldValidate: true });
    setLocationStates((prev) =>
      prev.map((state, i) =>
        i === index ? { ...state, isMapModalOpen: false } : state
      )
    );
  };

  const onSubmit = (data: TFormSchema) => {
    const visitDetails = data.visits.map((visit) => ({
      time: moment(visit.time, "HH:mm").format("h:mm A"),
      duration: Number(visit.duration),
      purpose: visit.purpose,
      customerId: visit.customer,
      priority: visit.priority,
      streetAddress: visit.address || "",
      city: visit.city || "",
      state: visit.state || "",
      zipCode: visit.zipCode ? parseInt(visit.zipCode) : 0,
      latitude: visit.latitude || 0,
      longitude: visit.longitude || 0,
      country: visit.country || "",
      preparationNotes: visit.preparationNotes || "",
    }));

    if (isEditMode) {
      updateVisit({
        date: moment(data.date).format("DD-MM-YYYY"),
        ...visitDetails[0],
      });
    } else {
      createVisit({
        salesRepresentativeUserId: data.salesRep,
        date: moment(data.date).format("DD-MM-YYYY"),
        visits: visitDetails,
      });
    }
  };

  const { mutate: createVisit, isPending: isCreateLoading } = useCreateVisits(
    () => {
      const salesRepId = watch("salesRep");
      reset({
        date: new Date().toISOString().split("T")[0],
        salesRep: salesRepId,
        visits: [
          {
            purpose: "",
            customer: "",
            time: "",
            location: "",
            address: "",
            city: "",
            state: "",
            zipCode: "",
            country: "",
            latitude: undefined,
            longitude: undefined,
            reportType: "",
            priority: "Medium",
            duration: "1",
            preparationNotes: "",
          },
        ],
      });
    }
  );
  const { mutate: updateVisit, isPending: isUpdateLoading } = useUpdateVisits(
    visitId || "",
    onClose
  );
  const isLoading = isCreateLoading || isUpdateLoading;
  const showLoadingSpinner = isEditMode && isVisitLoading;

  const addNewVisit = () => {
    append({
      purpose: "",
      customer: "",
      time: "",
      location: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      latitude: 0,
      longitude: 0,
      reportType: "",
      priority: "Medium",
      duration: "1",
      preparationNotes: "",
    });
  };

  return (
    <Main className="flex flex-col gap-4 !p-0">
      {locationStates.map((state, index) => (
        <LocationPicker
          key={index}
          open={state.isMapModalOpen}
          onOpenChange={(open) =>
            setLocationStates((prev) =>
              prev.map((s, i) =>
                i === index ? { ...s, isMapModalOpen: open } : s
              )
            )
          }
          onLocationSelect={(data) => handleMapLocationSelect(data, index)}
          latLng={state.latLng}
        />
      ))}
      <DeleteVisitDialog
        visit={visitToDelete}
        isOpen={!!visitToDelete}
        onClose={() => setVisitToDelete(null)}
      />
      <div className="grid grid-cols-12 gap-4">
        <Card className="col-span-8">
          <CardContent>
            {showLoadingSpinner ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="border-primary mx-auto h-8 w-8 animate-spin rounded-full border-b-2"></div>
                  <p className="text-muted-foreground mt-2 text-sm">
                    Loading visit details...
                  </p>
                </div>
              </div>
            ) : visitError ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <AlertCircle className="mx-auto h-8 w-8 text-red-500" />
                  <p className="mt-2 text-sm text-red-500">
                    Error loading visit details: {visitError.message}
                  </p>
                </div>
              </div>
            ) : (
              <FormProvider {...form}>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
                  className="space-y-4"
                >
                  {/* Shared Date and Sales Representative Fields */}
                  <div className="grid grid-cols-2 gap-4 border-b pb-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">
                        Date <span className="text-red-500">*</span>
                      </Label>
                      <Controller
                        name="date"
                        control={control}
                        render={({ field }) => (
                          <SimpleDatePicker
                            date={field.value || ""}
                            setDate={(date: string) => field.onChange(date)}
                            className={"w-full"}
                            disablePast
                          />
                        )}
                      />
                      {errors.date && (
                        <p className="text-xs flex items-center gap-1 text-red-500">
                          <AlertCircle className="h-3 w-3" />
                          {errors.date.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="salesRep">
                        Sales Representative{" "}
                        <span className="text-red-500">*</span>
                      </Label>
                      <Controller
                        name="salesRep"
                        control={control}
                        render={({ field }) => (
                          <SearchableSelect
                            options={users}
                            value={field.value}
                            onChange={field.onChange}
                            placeholder={
                              isUsersLoading ? "Loading..." : "Select user..."
                            }
                            disabled={isUsersLoading || isEditMode}
                          />
                        )}
                      />
                      {errors.salesRep && (
                        <p className="flex items-center gap-1 text-xs text-red-500">
                          <AlertCircle className="h-3 w-3" />
                          {errors.salesRep.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Visit Forms */}
                  <ScrollArea className="h-[calc(100vh-380px)] pr-4">
                    {fields.map((field, index) => (
                      <div
                        key={field.id}
                        className={cn(
                          "border p-4 rounded-md relative",
                          index !== 0 && "mt-4"
                        )}
                      >
                        <div className="flex justify-between items-center mb-4">
                          {!isEditMode && (
                            <h3 className="text-lg font-semibold">
                              Visit {index + 1}
                            </h3>
                          )}
                          {fields.length > 1 && !isEditMode && (
                            <Button
                              variant={"outline"}
                              type="button"
                              className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700"
                              size="sm"
                              onClick={() => remove(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          {/* Purpose */}
                          <div className="space-y-2">
                            <Label htmlFor={`visits.${index}.purpose`}>
                              Purpose of Visit{" "}
                              <span className="text-red-500">*</span>
                            </Label>
                            <Controller
                              name={`visits.${index}.purpose`}
                              control={control}
                              render={({ field }) => (
                                <Input
                                  id={`visits.${index}.purpose`}
                                  placeholder="Enter purpose of visit"
                                  {...field}
                                />
                              )}
                            />
                            {errors.visits?.[index]?.purpose && (
                              <p className="flex items-center gap-1 text-xs text-red-500">
                                <AlertCircle className="h-3 w-3" />
                                {errors.visits[index].purpose.message}
                              </p>
                            )}
                          </div>
                          {/* Customer */}
                          <div className="space-y-2">
                            <Label htmlFor={`visits.${index}.customer`}>
                              Customer <span className="text-red-500">*</span>
                            </Label>
                            <Controller
                              name={`visits.${index}.customer`}
                              control={control}
                              render={({ field }) => (
                                <SearchableSelect
                                  options={customerOptions}
                                  value={field.value}
                                  onChange={(value) => {
                                    field.onChange(value);
                                    const selectedCustomer = customerList.find(
                                      (c: any) => c.customerId === value
                                    );
                                    if (selectedCustomer) {
                                      setLocationStates((prev) =>
                                        prev.map((state, i) =>
                                          i === index
                                            ? {
                                                ...state,
                                                isCustomLocation: false,
                                              }
                                            : state
                                        )
                                      );
                                      const fullAddress = [
                                        selectedCustomer.streetAddress,
                                        selectedCustomer.city,
                                        selectedCustomer.state,
                                        selectedCustomer.country,
                                      ]
                                        .filter(Boolean)
                                        .join(", ");
                                      setValue(
                                        `visits.${index}.location`,
                                        fullAddress,
                                        {
                                          shouldValidate: true,
                                        }
                                      );
                                      setValue(
                                        `visits.${index}.address`,
                                        selectedCustomer.streetAddress || "",
                                        { shouldValidate: true }
                                      );
                                      setValue(
                                        `visits.${index}.city`,
                                        selectedCustomer.city || "",
                                        { shouldValidate: true }
                                      );
                                      setValue(
                                        `visits.${index}.state`,
                                        selectedCustomer.state || "",
                                        { shouldValidate: true }
                                      );
                                      setValue(
                                        `visits.${index}.zipCode`,
                                        String(selectedCustomer.zipCode || ""),
                                        { shouldValidate: true }
                                      );
                                      setValue(
                                        `visits.${index}.country`,
                                        selectedCustomer.country || "",
                                        { shouldValidate: true }
                                      );
                                      setValue(
                                        `visits.${index}.latitude`,
                                        selectedCustomer.latitude,
                                        { shouldValidate: true }
                                      );
                                      setValue(
                                        `visits.${index}.longitude`,
                                        selectedCustomer.longitude,
                                        { shouldValidate: true }
                                      );
                                    }
                                  }}
                                  placeholder={
                                    isCustomersLoading
                                      ? "Loading..."
                                      : "Select customer..."
                                  }
                                  disabled={isCustomersLoading}
                                />
                              )}
                            />
                            {errors.visits?.[index]?.customer && (
                              <p className="text-xs flex items-center gap-1 text-red-500">
                                <AlertCircle className="h-3 w-3" />
                                {errors.visits[index].customer.message}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Address Fields */}
                        <div className="space-y-2 mt-4">
                          <Label htmlFor={`visits.${index}.address`}>
                            Street Address{" "}
                            <span className="text-red-500">*</span>
                          </Label>
                          <Controller
                            name={`visits.${index}.address`}
                            control={control}
                            render={({ field }) => (
                              <Input
                                {...field}
                                id={`visits.${index}.address`}
                                placeholder="Enter Street Address"
                              />
                            )}
                          />
                          {errors.visits?.[index]?.address && (
                            <p className="flex items-center gap-1 text-xs text-red-500">
                              <AlertCircle className="h-3 w-3" />
                              {errors.visits[index].address.message}
                            </p>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div className="space-y-2">
                            <Label htmlFor={`visits.${index}.time`}>
                              Time <span className="text-red-500">*</span>
                            </Label>
                            <Controller
                              name={`visits.${index}.time`}
                              control={control}
                              render={({ field }) => (
                                <TimePicker
                                  value={field.value}
                                  onChange={field.onChange}
                                  date={selectedDate}
                                  disablePast={true}
                                  className="w-full"
                                />
                              )}
                            />
                            {errors.visits?.[index]?.time && (
                              <p className="text-xs flex items-center gap-1 text-red-500">
                                <AlertCircle className="h-3 w-3" />
                                {errors.visits[index].time.message}
                              </p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`visits.${index}.duration`}>
                              Duration (hours){" "}
                              <span className="text-red-500">*</span>
                            </Label>
                            <Controller
                              name={`visits.${index}.duration`}
                              control={control}
                              render={({ field }) => (
                                <Input
                                  id={`visits.${index}.duration`}
                                  type="number"
                                  min="0"
                                  step="0.25"
                                  {...field}
                                />
                              )}
                            />
                            {errors.visits?.[index]?.duration && (
                              <p className="text-xs flex items-center gap-1 text-red-500">
                                <AlertCircle className="h-3 w-3" />
                                {errors.visits[index].duration.message}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div className="space-y-2">
                            <Label htmlFor={`visits.${index}.priority`}>
                              Priority <span className="text-red-500">*</span>
                            </Label>
                            <Controller
                              name={`visits.${index}.priority`}
                              control={control}
                              render={({ field }) => (
                                <ShadSelect
                                  value={field.value}
                                  onValueChange={field.onChange}
                                >
                                  <SelectTrigger
                                    id={`visits.${index}.priority`}
                                    className="w-full"
                                  >
                                    <SelectValue placeholder="Select Priority" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="High">High</SelectItem>
                                    <SelectItem value="Medium">
                                      Medium
                                    </SelectItem>
                                    <SelectItem value="Low">Low</SelectItem>
                                  </SelectContent>
                                </ShadSelect>
                              )}
                            />
                            {errors.visits?.[index]?.priority && (
                              <p className="text-xs flex items-center gap-1 text-red-500">
                                <AlertCircle className="h-3 w-3" />
                                {errors.visits[index].priority.message}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="space-y-2 mt-4">
                          <Label htmlFor={`visits.${index}.preparationNotes`}>
                            Preparation Notes
                          </Label>
                          <Controller
                            name={`visits.${index}.preparationNotes`}
                            control={control}
                            render={({ field }) => (
                              <Input
                                id={`visits.${index}.preparationNotes`}
                                placeholder="Any special preparation or notes for the visit..."
                                {...field}
                              />
                            )}
                          />
                        </div>
                        {/* Checkbox for Custom Location */}
                        <div className="flex items-center space-x-2 pt-4">
                          <Checkbox
                            id={`custom-location-${index}`}
                            checked={locationStates[index]?.isCustomLocation}
                            onCheckedChange={(checked) =>
                              setLocationStates((prev) =>
                                prev.map((state, i) =>
                                  i === index
                                    ? {
                                        ...state,
                                        isCustomLocation: Boolean(checked),
                                      }
                                    : state
                                )
                              )
                            }
                          />
                          <Label
                            htmlFor={`custom-location-${index}`}
                            className="cursor-pointer font-normal"
                          >
                            Set a Different/More Specific Visit Location
                          </Label>
                        </div>
                        {/* Conditionally Rendered Location Tools */}
                        {locationStates[index]?.isCustomLocation && (
                          <div className="grid grid-cols-2 gap-4 border-t pt-4 mt-2 animate-in fade-in-0 duration-300">
                            <div className="space-y-2">
                              <Label>Location Input Method</Label>
                              <RadioGroup
                                value={locationStates[index]?.locationInputMode}
                                onValueChange={(value) =>
                                  setLocationStates((prev) =>
                                    prev.map((state, i) =>
                                      i === index
                                        ? {
                                            ...state,
                                            locationInputMode: value as
                                              | "search"
                                              | "map",
                                          }
                                        : state
                                    )
                                  )
                                }
                                className="flex items-center space-x-4 pt-1"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="map"
                                    id={`r_map-${index}`}
                                  />
                                  <Label
                                    htmlFor={`r_map-${index}`}
                                    className="cursor-pointer font-normal"
                                  >
                                    From Map
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="search"
                                    id={`r_search-${index}`}
                                  />
                                  <Label
                                    htmlFor={`r_search-${index}`}
                                    className="cursor-pointer font-normal"
                                  >
                                    From Lat Lng
                                  </Label>
                                </div>
                              </RadioGroup>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`location-finder-${index}`}>
                                Find Location{" "}
                                <span className="text-red-500">*</span>
                              </Label>
                              {locationStates[index]?.locationInputMode ===
                              "search" ? (
                                <Input
                                  id={`location-finder-${index}`}
                                  type="text"
                                  placeholder="23.114007367862843, 72.5413259310343"
                                  value={locationStates[index]?.latLng}
                                  onChange={(e) =>
                                    setLocationStates((prev) =>
                                      prev.map((state, i) =>
                                        i === index
                                          ? { ...state, latLng: e.target.value }
                                          : state
                                      )
                                    )
                                  }
                                />
                              ) : (
                                <Button
                                  id={`location-finder-${index}`}
                                  type="button"
                                  variant="outline"
                                  onClick={() =>
                                    setLocationStates((prev) =>
                                      prev.map((state, i) =>
                                        i === index
                                          ? { ...state, isMapModalOpen: true }
                                          : state
                                      )
                                    )
                                  }
                                  className="w-full justify-start text-left font-normal"
                                >
                                  <MapPin className="mr-2 h-4 w-4" />
                                  Change Location from Map
                                </Button>
                              )}
                              {(errors.visits?.[index]?.latitude ||
                                errors.visits?.[index]?.longitude) && (
                                <p className="text-xs flex items-center gap-1 text-red-500">
                                  <AlertCircle className="h-3 w-3" />
                                  {errors.visits[index]?.latitude?.message ||
                                    errors.visits[index]?.longitude?.message ||
                                    "Please select a valid location."}
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}

                    {!isEditMode && (
                      <TooltipProvider>
                        <Tooltip delayDuration={100}>
                          <TooltipTrigger asChild>
                            <span className="inline-block mt-3">
                              <Button
                                type="button"
                                onClick={addNewVisit}
                                disabled={!areRequiredFieldsFilled}
                              >
                                Add Another Visit
                              </Button>
                            </span>
                          </TooltipTrigger>
                          {!areRequiredFieldsFilled && ( // Show tooltip only when button is disabled
                            <TooltipContent>
                              <p>
                                Please fill all required (*) fields in the
                                current visit.
                              </p>
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </ScrollArea>
                  <div className="flex justify-end space-x-2 ">
                    <Button type="button" variant="outline" onClick={onClose}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading
                        ? "Saving..."
                        : isEditMode
                          ? "Update Visit"
                          : "Schedule Visits"}
                    </Button>
                  </div>
                </form>
              </FormProvider>
            )}
          </CardContent>
        </Card>
        <Card className="col-span-4">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Today's Schedule</CardTitle>
              <CardDescription className="mt-2">
                Visits scheduled for{" "}
                {moment(selectedDate).format("MMMM D, YYYY")}{" "}
                {selectedRep ? `for selected representative` : ""}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {isVisitsLoading && <p>Loading visits...</p>}
            {visitsError && (
              <p className="text-red-500">
                Error fetching visits: {visitsError.message}
              </p>
            )}
            {!isVisitsLoading &&
              !visitsError &&
              upcomingVisits.length === 0 && (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="rounded-full bg-gray-100 p-4 mb-4">
                    <MapPin className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    No Visits Found
                  </h3>
                  <p className="text-sm text-gray-500 max-w-xs">
                    No visits are scheduled for{" "}
                    {moment(selectedDate).format("MMMM D, YYYY")}
                    {selectedRep
                      ? " with the selected sales representative"
                      : ""}
                    .
                  </p>
                </div>
              )}
            <ScrollArea className="h-[calc(100vh-300px)] pr-4">
              <div className="grid grid-cols-1 gap-4">
                {upcomingVisits
                  .filter(
                    (visit) =>
                      visit.date === selectedDate &&
                      (!selectedRep || visit.salesRepId === selectedRep)
                  )
                  .map((visit) => (
                    <div
                      key={visit.id}
                      className="flex items-center space-x-4 rounded-lg border p-2"
                    >
                      <div className="flex-shrink-0">
                        <Clock className="text-muted-foreground h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-medium">{visit.time}</p>
                          <Badge className={getPriorityBadge(visit.priority)}>
                            {visit.priority}
                          </Badge>
                          <Badge className={getStatusBadge(visit.status)}>
                            {visit.status}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground text-sm">
                          {visit.customer} - {visit.purpose}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          Rep: {visit.rep}
                        </p>
                        {/* <div className="flex gap-1 mt-1">
                          <PermissionGate
                            requiredPermission="calender_view"
                            action="viewOwn"
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              aria-label={`View details for visit ${visit.id}`}
                            >
                              <Eye />
                            </Button>
                          </PermissionGate>
                          <PermissionGate
                            requiredPermission="calender_view"
                            action="edit"
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                navigate({
                                  to: `/calendar/schedule-visit/${visit.id}`,
                                })
                              }
                              aria-label={`Edit visit ${visit.id}`}
                            >
                              <Edit />
                            </Button>
                          </PermissionGate>
                          <PermissionGate
                            requiredPermission="calender_view"
                            action="delete"
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setVisitToDelete(visit)}
                              aria-label={`Delete visit ${visit.id}`}
                            >
                              <Trash />
                            </Button>
                          </PermissionGate>
                        </div> */}
                      </div>
                    </div>
                  ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </Main>
  );
}

export default ScheduleVisitForm;
