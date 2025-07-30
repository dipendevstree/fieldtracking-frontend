import { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "@tanstack/react-router";
import { AlertCircle, MapPin } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox"; // Import Checkbox
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

  const [isCustomLocation, setIsCustomLocation] = useState(false); // State for checkbox
  const [locationInputMode, setLocationInputMode] = useState<"search" | "map">(
    "map"
  );
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [latLng, setLatLng] = useState("");

  const form = useForm<TFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      purpose: "",
      customer: "",
      salesRep: "",
      date: new Date().toISOString().split("T")[0],
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
  });

  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
    watch,
  } = form;

  const customerId = watch("customer");

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
        purpose: visitData.purpose || "",
        customer: visitData.customerId || "",
        salesRep: visitData.salesRepresentativeUser?.id || "",
        date: formatDateForInput(visitData.date),
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
      };
      reset(formData);
    } else if (!isEditMode) {
      reset();
      setIsCustomLocation(false);
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

  useEffect(() => {
    if (customerId && customerList?.length) {
      const selectedCustomer = customerList.find(
        (c: any) => c.customerId === customerId
      );

      if (selectedCustomer) {
        // When a customer is selected, auto-fill the address but keep custom location off.
        setIsCustomLocation(false);
        const fullAddress = [
          selectedCustomer.streetAddress,
          selectedCustomer.city,
          selectedCustomer.state,
          selectedCustomer.country,
        ]
          .filter(Boolean)
          .join(", ");
        setValue("location", fullAddress, { shouldValidate: true });
        setValue("address", selectedCustomer.streetAddress || "", {
          shouldValidate: true,
        });
        setValue("city", selectedCustomer.city || "", { shouldValidate: true });
        setValue("state", selectedCustomer.state || "", {
          shouldValidate: true,
        });
        setValue("zipCode", String(selectedCustomer.zipCode || ""), {
          shouldValidate: true,
        });
        setValue("country", selectedCustomer.country || "", {
          shouldValidate: true,
        });
        setValue("latitude", selectedCustomer.latitude, {
          shouldValidate: true,
        });
        setValue("longitude", selectedCustomer.longitude, {
          shouldValidate: true,
        });
      }
    }
  }, [customerId, customerList, setValue, isEditMode]);

  const handleMapLocationSelect = (data: {
    lat: number;
    lng: number;
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  }) => {
    setValue("location", data.address, { shouldValidate: true });
    setValue("address", data.address, { shouldValidate: true });
    setValue("city", data.city, { shouldValidate: true });
    setValue("state", data.state, { shouldValidate: true });
    setValue("zipCode", data.postalCode, { shouldValidate: true });
    setValue("country", data.country, { shouldValidate: true });
    setValue("latitude", data.lat, { shouldValidate: true });
    setValue("longitude", data.lng, { shouldValidate: true });
    setIsMapModalOpen(false);
  };

  const onSubmit = (data: TFormSchema) => {
    const formattedTime = moment(data.time, "HH:mm").format("h:mm A");
    const visitDetails = {
      time: formattedTime,
      duration: parseInt(data.duration),
      purpose: data.purpose,
      customerId: data.customer,
      priority: data.priority,
      streetAddress: data.address || "",
      city: data.city || "",
      state: data.state || "",
      zipCode: data.zipCode ? parseInt(data.zipCode) : 0,
      latitude: data.latitude || 0,
      longitude: data.longitude || 0,
      country: data.country || "",
      preparationNotes: data.preparationNotes || "",
    };

    if (isEditMode) {
      updateVisit({
        date: moment(data.date).format("DD-MM-YYYY"),
        ...visitDetails,
      });
    } else {
      createVisit({
        salesRepresentativeUserId: data.salesRep,
        date: moment(data.date).format("DD-MM-YYYY"),
        visits: [visitDetails],
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

  return (
    <Main className="flex flex-col gap-6 p-6">
      <LocationPicker
        open={isMapModalOpen}
        onOpenChange={setIsMapModalOpen}
        onLocationSelect={handleMapLocationSelect}
        latLng={latLng}
      />
      <Card>
        <CardHeader>
          <CardTitle>
            {isEditMode ? "Edit Visit" : "Schedule New Visit"}
          </CardTitle>
          <CardDescription>
            {isEditMode
              ? "Update the visit details below"
              : "Fill in the details to schedule a new visit"}
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
                <div className="grid grid-cols-2 gap-4">
                  {/* Purpose */}
                  <div className="space-y-2">
                    <Label htmlFor="purpose">
                      Purpose of Visit <span className="text-red-500">*</span>
                    </Label>
                    <Controller
                      name="purpose"
                      control={control}
                      render={({ field }) => (
                        <Input
                          id="purpose"
                          placeholder="Enter purpose of visit"
                          {...field}
                        />
                      )}
                    />
                    {errors.purpose && (
                      <p className="flex items-center gap-1 text-xs text-red-500">
                        <AlertCircle className="h-3 w-3" />
                        {errors.purpose.message}
                      </p>
                    )}
                  </div>
                  {/* Customer */}
                  <div className="space-y-2">
                    <Label htmlFor="customer">
                      Customer <span className="text-red-500">*</span>
                    </Label>
                    <Controller
                      name="customer"
                      control={control}
                      render={({ field }) => (
                        <SearchableSelect
                          options={customerOptions}
                          value={field.value}
                          onChange={field.onChange}
                          placeholder={
                            isCustomersLoading
                              ? "Loading..."
                              : "Select customer..."
                          }
                          disabled={isCustomersLoading}
                        />
                      )}
                    />
                    {errors.customer && (
                      <p className="text-xs flex items-center gap-1 text-red-500">
                        <AlertCircle className="h-3 w-3" />
                        {errors.customer.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Sales Rep */}
                <div className="space-y-2">
                  <Label htmlFor="salesRep">
                    Sales Representative <span className="text-red-500">*</span>
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

                {/* Always visible address fields */}
                <div className="space-y-2">
                  <Label htmlFor="address">
                    Street Address <span className="text-red-500">*</span>
                  </Label>
                  <Controller
                    name="address"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="address"
                        placeholder="Enter Street Address"
                      />
                    )}
                  />
                  {errors.address && (
                    <p className="flex items-center gap-1 text-xs text-red-500">
                      <AlertCircle className="h-3 w-3" />
                      {errors.address.message}
                    </p>
                  )}
                </div>
                {/* <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">
                      City <span className="text-red-500">*</span>
                    </Label>
                    <Controller
                      name="city"
                      control={control}
                      render={({ field }) => (
                        <Input {...field} id="city" placeholder="Enter City" />
                      )}
                    />
                    {errors.city && (
                      <p className="flex items-center gap-1 text-xs text-red-500">
                        <AlertCircle className="h-3 w-3" />
                        {errors.city.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">
                      State/Province <span className="text-red-500">*</span>
                    </Label>
                    <Controller
                      name="state"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          id="state"
                          placeholder="Enter State"
                        />
                      )}
                    />
                    {errors.state && (
                      <p className="flex items-center gap-1 text-xs text-red-500">
                        <AlertCircle className="h-3 w-3" />
                        {errors.state.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">
                      ZIP/Postal Code <span className="text-red-500">*</span>
                    </Label>
                    <Controller
                      name="zipCode"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          id="zipCode"
                          placeholder="Enter Zip Code"
                        />
                      )}
                    />
                    {errors.zipCode && (
                      <p className="flex items-center gap-1 text-xs text-red-500">
                        <AlertCircle className="h-3 w-3" />
                        {errors.zipCode.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">
                      Country <span className="text-red-500">*</span>
                    </Label>
                    <Controller
                      name="country"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          id="country"
                          placeholder="Enter Country"
                        />
                      )}
                    />
                    {errors.country && (
                      <p className="flex items-center gap-1 text-xs text-red-500">
                        <AlertCircle className="h-3 w-3" />
                        {errors.country.message}
                      </p>
                    )}
                  </div>
                </div> */}

                <div className="grid grid-cols-2 gap-4 border-t pt-4 mt-2">
                  <div className="w-full space-y-2">
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
                    <Label htmlFor="time">
                      Time <span className="text-red-500">*</span>
                    </Label>
                    <Controller
                      name="time"
                      control={control}
                      render={({ field }) => (
                        <Input type="time" id="time" {...field} />
                      )}
                    />
                    {errors.time && (
                      <p className="text-xs flex items-center gap-1 text-red-500">
                        <AlertCircle className="h-3 w-3" />
                        {errors.time.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="priority">
                      Priority <span className="text-red-500">*</span>
                    </Label>
                    <Controller
                      name="priority"
                      control={control}
                      render={({ field }) => (
                        <ShadSelect
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger id="priority" className="w-full">
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
                    {errors.priority && (
                      <p className="text-xs flex items-center gap-1 text-red-500">
                        <AlertCircle className="h-3 w-3" />
                        {errors.priority.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">
                      Duration (hours) <span className="text-red-500">*</span>
                    </Label>
                    <Controller
                      name="duration"
                      control={control}
                      render={({ field }) => (
                        <Input id="duration" type="number" min="1" {...field} />
                      )}
                    />
                    {errors.duration && (
                      <p className="text-xs flex items-center gap-1 text-red-500">
                        <AlertCircle className="h-3 w-3" />
                        {errors.duration.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="preparationNotes">Preparation Notes</Label>
                  <Controller
                    name="preparationNotes"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="preparationNotes"
                        placeholder="Any special preparation or notes for the visit..."
                        {...field}
                      />
                    )}
                  />
                </div>
                {/* --- Checkbox to show custom location tools --- */}
                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox
                    id="custom-location"
                    checked={isCustomLocation}
                    onCheckedChange={(checked) =>
                      setIsCustomLocation(Boolean(checked))
                    }
                  />
                  <Label
                    htmlFor="custom-location"
                    className="cursor-pointer font-normal"
                  >
                    Set a Different/More Specific Visit Location
                  </Label>
                </div>

                {/* --- Conditionally rendered location tools --- */}
                {isCustomLocation && (
                  <div className="grid grid-cols-2 gap-4 border-t pt-4 mt-2 animate-in fade-in-0 duration-300">
                    <div className="space-y-2">
                      <Label>Location Input Method</Label>
                      <RadioGroup
                        value={locationInputMode}
                        onValueChange={(value) =>
                          setLocationInputMode(value as "search" | "map")
                        }
                        className="flex items-center space-x-4 pt-1"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="map" id="r_map" />
                          <Label
                            htmlFor="r_map"
                            className="cursor-pointer font-normal"
                          >
                            From Map
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="search" id="r_search" />
                          <Label
                            htmlFor="r_search"
                            className="cursor-pointer font-normal"
                          >
                            From Lat Lng
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location-finder">
                        Find Location <span className="text-red-500">*</span>
                      </Label>
                      {locationInputMode === "search" ? (
                        <Input
                          id="location-finder"
                          type="text"
                          placeholder="23.114007367862843, 72.5413259310343"
                          value={latLng}
                          onChange={(e) => setLatLng(e.target.value)}
                        />
                      ) : (
                        <Button
                          id="location-finder"
                          type="button"
                          variant="outline"
                          onClick={() => setIsMapModalOpen(true)}
                          className="w-full justify-start text-left font-normal"
                        >
                          <MapPin className="mr-2 h-4 w-4" />
                          Change Location from Map
                        </Button>
                      )}
                      {(errors.latitude || errors.longitude) && (
                        <p className="text-xs flex items-center gap-1 text-red-500">
                          <AlertCircle className="h-3 w-3" />
                          {errors.latitude?.message ||
                            errors.longitude?.message ||
                            "Please select a valid location."}
                        </p>
                      )}
                    </div>
                  </div>
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
                        : "Schedule Visit"}
                  </Button>
                </div>
              </form>
            </FormProvider>
          )}
        </CardContent>
      </Card>
    </Main>
  );
}

export default ScheduleVisitForm;
