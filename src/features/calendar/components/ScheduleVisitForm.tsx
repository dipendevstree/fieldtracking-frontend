import { useEffect, useState } from "react";
import {
  Controller,
  FormProvider,
  useForm,
  useFieldArray,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "@tanstack/react-router";
import { AlertCircle, MapPin, Trash2 } from "lucide-react";
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
import { useGetUsersForDropdown } from "@/features/buyers/services/users.hook";
import { formSchema, TFormSchema } from "../data/schema";
import {
  useCreateVisits,
  useUpdateVisits,
  useGetVisitByID,
  useGetAllCustomer,
} from "../services/calendar-view.hook";
import LocationPicker from "@/features/customers/components/LocationPicker";

interface ScheduleVisitFormProps {
  onClose: () => void;
}

export function ScheduleVisitForm({ onClose }: ScheduleVisitFormProps) {
  const params = useParams({ strict: false });
  const visitId = params.id;
  const isEditMode = !!visitId;

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
    formState: { errors },
  } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "visits",
  });

  const {
    data: visitData,
    isLoading: isVisitLoading,
    error: visitError,
  } = useGetVisitByID(visitId || "", isEditMode);

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
  }, [visitData, isEditMode, reset]);

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
      duration: parseInt(visit.duration),
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

  const { mutate: createVisit, isPending: isCreateLoading } =
    useCreateVisits(onClose);
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
    <Main className="flex flex-col gap-6 p-6">
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
      <div className="grid grid-cols-12 gap-4">
        <Card className="col-span-8">
          <CardHeader>
            <CardTitle>
              {isEditMode ? "Edit Visit" : "Schedule New Visit"}
            </CardTitle>
            <CardDescription>
              {isEditMode
                ? "Update the visit details below"
                : "Fill in the details to schedule new visits"}
            </CardDescription>
          </CardHeader>
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
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="border p-4 rounded-md relative"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">
                          Visit {index + 1}
                        </h3>
                        {fields.length > 1 && !isEditMode && (
                          <Button
                            type="button"
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
                          Street Address <span className="text-red-500">*</span>
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
                              <Input
                                type="time"
                                id={`visits.${index}.time`}
                                {...field}
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
                                min="1"
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
                                  <SelectItem value="Medium">Medium</SelectItem>
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
                    <Button
                      type="button"
                      onClick={addNewVisit}
                      className="mt-4"
                    >
                      Add Another Visit
                    </Button>
                  )}
                  <div className="flex justify-end space-x-2 pt-4">
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
        <Card className="col-span-4"></Card>
      </div>
    </Main>
  );
}

export default ScheduleVisitForm;
