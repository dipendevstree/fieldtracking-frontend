import { useEffect, useRef, useState } from "react";
import { Controller, useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AlertCircle, Plus, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Form } from "@/components/ui/form";
import BulkImport from "./bulk-import";
import UploadHistory from "./upload-history";
import {
  useGetCustomerById,
  useGetIndustry,
  useUpdateCustomer,
} from "../services/Customers.hook";
import { useGetAllCustomerType } from "@/features/customer-type/services/CustomerTypehook";
import { useSelectOptions } from "@/hooks/use-select-option";
import { useGetAllRolesForDropdown } from "@/features/UserManagement/services/Roles.hook";
import { useGetUsersForDropdown } from "@/features/buyers/services/users.hook";
import type { CustomerType } from "@/features/customer-type/type/type";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useCreateCustomer } from "../services/Customers.hook";
import type { CreateCustomerPayload } from "../services/Customers.hook";
import { LocationAutoSearchBox } from "./LocationAutoSearchBox";

// Define Zod schema
const customerFormSchema = z.object({
  companyName: z.string().min(1, "Company Name is required"),
  industry: z.string().min(1, "Industry is required"),
  customerType: z.string().min(1, "Customer Type is required"),
  address: z.string().min(1, "Street Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(1, "Zip Code is required"),
  country: z.string().min(1, "Country is required"),
  notes: z.string().optional(),
  latitude: z.number().min(1, "Latitude is required"),
  longitude: z.number().min(1, "Longitude is required"),
  contacts: z
    .array(
      z.object({
        id: z.any(),
        name: z.string().min(1, "Contact Name is required"),
        email: z
          .string()
          .email("Invalid email address")
          .min(1, "Email is required"),
        phone: z.string().min(1, "Phone Number is required"),
        designation: z.string().optional(),
        isPrimary: z.boolean(),
        userRole: z.string().optional(),
        assignedRep: z.string().optional(),
      })
    )
    .min(1, "At least one contact is required"),
});

type TCustomerFormSchema = z.infer<typeof customerFormSchema>;

interface AddCustomerPageProps {
  onCustomerAdded?: () => void;
}

export default function AddCustomerPage({
  onCustomerAdded: _unused1,
}: AddCustomerPageProps) {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState<string>("individual");
  const [submissionStatus, setSubmissionStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [messageType, setMessageType] = useState<"draft" | "final">("final");
  const formRef = useRef<HTMLFormElement>(null);
  const { customerId } = useParams({ strict: false });
  const isEditMode = !!customerId;

  const { data: customer } = useGetCustomerById(
    customerId ?? "",
    isEditMode // Only run this query if we are in edit mode
  );

  const { mutate: updateCustomer } = useUpdateCustomer(customerId ?? "", () => {
    setSubmissionStatus("success");
    setTimeout(() => {
      setSubmissionStatus("idle");
      navigate({ to: "/customers" });
    }, 2000);
  });

  // Add create customer mutation
  const { mutate: createCustomer } = useCreateCustomer(() => {
    // setSubmissionStatus("success");
    setTimeout(() => {
      setSubmissionStatus("idle");
      form.reset(); // Reset form on success
      navigate({ to: "/customers" });
    }, 2000);
  });

  const form = useForm<TCustomerFormSchema>({
    resolver: zodResolver(customerFormSchema),
    shouldUnregister: false,
    defaultValues: {
      companyName: "",
      industry: "",
      customerType: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      notes: "",
      latitude: undefined,
      longitude: undefined,
      contacts: [
        {
          id: Date.now(),
          name: "",
          email: "",
          phone: "",
          designation: "",
          isPrimary: true,
          userRole: "",
          assignedRep: "",
        },
      ],
    },
  });

  // Remove unused reset variable
  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = form;
  const { fields, append, remove, update, replace } = useFieldArray({
    control,
    name: "contacts",
  });

  console.log("ereroeroeoreor", errors);

  const { allCustomerType = [] } = useGetAllCustomerType({
    page: 1,
    limit: 100,
  });
  const { data: industryList = [] } = useGetIndustry();
  const [selectedRoleIds, setSelectedRoleIds] = useState<
    Record<number, string>
  >({});
  const { data: _usersList = [] } = useGetUsersForDropdown({
    roleId: "",
    enabled: false,
  });

  useEffect(() => {
    if (isEditMode && customer) {
      // a. Map the API data to the form's schema
      const formValues: TCustomerFormSchema = {
        companyName: customer.companyName,
        industry: customer.industryId,
        customerType: customer.customerTypeId,
        address: customer.streetAddress,
        city: customer.city,
        state: customer.state,
        country: customer.country,
        zipCode: String(customer.zipCode || ""), // Zod schema expects string
        notes: customer.additionalNotes || "",
        latitude: customer.latitude,
        longitude: customer.longitude,
        contacts:
          customer.customerContacts?.map((contact: any) => {
            const contactId = contact.customerContactId || Date.now(); // Use real ID or generate one
            // Pre-populate state for existing contacts
            if (contact.userRole?.roleId) {
              setSelectedRoleIds((prev) => ({
                ...prev,
                [contactId]: contact.userRole.roleId,
              }));
              loadUsersForContact(contactId, contact.userRole.roleId);
            }
            return {
              id: contactId, // useFieldArray needs a unique id
              name: contact.customerName,
              email: contact.email,
              phone: contact.phoneNumber,
              designation: contact.designation || "",
              isPrimary: contact.isPrimary,
              userRole: contact.userRole?.roleId || "",
              assignedRep: contact.assignUserId || "",
            };
          }) || [],
      };

      // b. Populate the entire form
      reset(formValues);

      // c. (Optional but good practice) Manually sync the field array state if reset doesn't cover it
      if (!isEditMode && formValues.contacts.length > 0) {
        replace(formValues.contacts);
      }
    }
  }, [isEditMode, customer, reset, replace]);

  // Add a new function to get users for a specific contact's role
  const getUsersForRole = (roleId: string) => {
    if (!roleId) return Promise.resolve([]);

    return fetch(
      `https://fieldtracking-api.devstree.in/api/v1/users/list?roleId=${roleId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        return response.json();
      })
      .then((data) => {
        if (data && data.data && Array.isArray(data.data.list)) {
          return data.data.list;
        }
        return [];
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        return [];
      });
  };

  // Add state to store users per contact
  const [usersPerContact, setUsersPerContact] = useState<
    Record<number, Array<{ id: string; firstName: string; lastName: string }>>
  >({});
  const [loadingUsersForContact, setLoadingUsersForContact] = useState<
    Record<number, boolean>
  >({});

  // Function to load users for a specific contact when role changes
  const loadUsersForContact = async (contactId: number, roleId: string) => {
    if (!roleId) return;

    try {
      setLoadingUsersForContact((prev) => ({ ...prev, [contactId]: true }));
      const users = await getUsersForRole(roleId);
      setUsersPerContact((prev) => ({ ...prev, [contactId]: users }));
    } catch (_err) {
      setUsersPerContact((prev) => ({ ...prev, [contactId]: [] }));
    } finally {
      setLoadingUsersForContact((prev) => ({ ...prev, [contactId]: false }));
    }
  };

  // Transform industry data for dropdown using the same pattern as organizations component
  const industryOptions = useSelectOptions<{
    industryId: string;
    industryName: string;
  }>({
    listData: industryList ?? [],
    labelKey: "industryName",
    valueKey: "industryId",
  });

  // Get roles from API
  const { data: rolesList = [] } = useGetAllRolesForDropdown();

  // Transform roles data for dropdown
  const roleOptions = useSelectOptions<{
    roleId: string;
    roleName: string;
  }>({
    listData: rolesList ?? [],
    labelKey: "roleName",
    valueKey: "roleId",
  });

  // Remove the setPrimaryContact function that enforces only one primary contact
  const togglePrimaryContact = (id: number) => {
    const contactIndex = fields.findIndex((field) => field.id === id);
    if (contactIndex !== -1) {
      const contactValues = getValues(`contacts.${contactIndex}`);
      const updatedContact = {
        ...contactValues,
        id,
        userRole: "",
        assignedRep: "",
        isPrimary: !contactValues.isPrimary,
      };
      console.log("hasdasello", updatedContact);
      update(contactIndex, updatedContact);
    }
  };

  // Update the onSubmitForm function to use the mutation
  const onSubmitForm = async (data: TCustomerFormSchema) => {
    try {
      setSubmissionStatus("idle");
      setMessageType("final");

      // Validate required fields
      if (!data.companyName || !data.contacts || data.contacts.length === 0) {
        setSubmissionStatus("error");
        return;
      }

      // Check if at least one contact is marked as primary
      const hasPrimaryContact = data.contacts.some(
        (contact) => contact.isPrimary
      );
      if (!hasPrimaryContact) {
        // If no primary contact is selected, mark the first one as primary
        data.contacts[0].isPrimary = true;
      }

      // Find primary contacts (can be multiple now)
      const primaryContacts = data.contacts.filter(
        (contact) => contact.isPrimary
      );
      const firstPrimaryContact = primaryContacts[0]; // Use first primary for main phone number

      // Prepare API payload
      const payload: CreateCustomerPayload = {
        companyName: data.companyName,
        phoneNumber: firstPrimaryContact.phone,
        industryId: data.industry,
        customerTypeId: data.customerType,
        streetAddress: data.address || "",
        city: data.city || "",
        state: data.state || "",
        zipCode: data.zipCode ? Number(data.zipCode) : undefined,
        latitude: data.latitude,
        longitude: data.longitude,
        country: data.country || "",
        customerContacts: data.contacts.map((contact) => ({
          customerName: contact.name,
          email: contact.email,
          designation: contact.designation || "",
          phoneNumber: contact.phone,
          isPrimary: contact.isPrimary,
          assignUserId: contact.assignedRep || null,
        })),
      };

      // Call the mutation
      if (isEditMode) {
        updateCustomer(payload);
      } else {
        createCustomer(payload);
      }
    } catch (_error) {
      setSubmissionStatus("error");
      setTimeout(() => setSubmissionStatus("idle"), 3000);
    }
  };

  const onError = (
    errors: import("react-hook-form").FieldErrors<TCustomerFormSchema>
  ) => {
    const firstError = Object.keys(errors)[0];
    const errorElement = document.getElementById(`${firstError}-error`);
    if (errorElement) {
      errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const addNewContact = () => {
    const newContactId = Date.now();
    append({
      id: newContactId,
      name: "",
      email: "",
      phone: "",
      designation: "",
      isPrimary: false,
      userRole: "",
      assignedRep: "",
    });

    // Initialize state for the new contact
    setSelectedRoleIds((prev) => ({ ...prev, [newContactId]: "" }));
    setUsersPerContact((prev) => ({ ...prev, [newContactId]: [] }));
    setLoadingUsersForContact((prev) => ({ ...prev, [newContactId]: false }));
  };

  // Before submitting the form, let's ensure the contacts are properly included
  handleSubmit((data) => {
    const formData = {
      ...data,
      contacts: fields.map((field, index) => {
        const contactValues = data.contacts[index] || {};

        // Ensure we have the correct id
        return {
          ...contactValues,
          id: field.id,
          isPrimary: !!contactValues.isPrimary,
        };
      }),
    };

    onSubmitForm(formData);
  }, onError);

  // Update the form reference
  return (
    <div className="flex-1 space-y-4 p-4 pt-22">
      <div className="flex items-center justify-between space-y-0">
        <h2 className="text-3xl font-bold tracking-tight">
          {"Customer Management"}
        </h2>
      </div>

      <Tabs
        value={selectedTab}
        onValueChange={setSelectedTab}
        className="space-y-4"
      >
        <TabsList className="grid w-auto grid-cols-3">
          <TabsTrigger value="individual">Add Individual</TabsTrigger>
          <TabsTrigger value="bulk">Bulk Import</TabsTrigger>
          <TabsTrigger value="uploads">Upload History</TabsTrigger>
        </TabsList>

        <TabsContent value="individual" className="space-y-4">
          <CardContent>
            <Form {...form}>
              <form
                ref={formRef}
                onSubmit={handleSubmit(onSubmitForm, onError)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                  }
                }}
                className="space-y-8"
              >
                <Card className="mb-6">
                  <CardHeader className="pb-0">
                    <CardTitle className="text-xl font-semibold">
                      {isEditMode ? "Edit Customer" : "Add New Customer"}
                    </CardTitle>
                    <CardDescription>
                      {isEditMode
                        ? "Update existing customer details and contact information."
                        : "Add a new customer to your database with complete contact and business information."}
                    </CardDescription>

                    <div className="border-t border-gray-200 -mx-4 mb-2" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold">
                        Company Information
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="companyName">Company Name *</Label>
                          <Controller
                            name="companyName"
                            control={control}
                            render={({ field }) => (
                              <Input
                                {...field}
                                id="companyName"
                                placeholder="Enter Company Name"
                                aria-describedby={
                                  errors.companyName
                                    ? "companyName-error"
                                    : undefined
                                }
                              />
                            )}
                          />
                          {errors.companyName && (
                            <p
                              id="companyName-error"
                              className="flex items-center gap-1 text-xs text-red-500"
                            >
                              <AlertCircle className="h-3 w-3" />
                              {errors.companyName.message}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="industry">Industry *</Label>
                          <Controller
                            name="industry"
                            control={control}
                            render={({ field }) => (
                              <Select
                                value={field.value || ""}
                                onValueChange={(val) => {
                                  if (val) {
                                    field.onChange(val);
                                  }
                                }}
                              >
                                <SelectTrigger
                                  className="w-full max-w-m"
                                  id="industry"
                                >
                                  <SelectValue placeholder="Select Industry" />
                                </SelectTrigger>
                                <SelectContent
                                  id="industry-content"
                                  className="!w-full"
                                >
                                  {industryOptions.length > 0 ? (
                                    industryOptions.map((option) => (
                                      <SelectItem
                                        key={option.value}
                                        value={String(option.value)}
                                      >
                                        {option.label}
                                      </SelectItem>
                                    ))
                                  ) : (
                                    <div className="px-4 py-2 text-gray-500">
                                      No industries found
                                    </div>
                                  )}
                                </SelectContent>
                              </Select>
                            )}
                          />
                          {errors.industry && (
                            <p
                              id="industry-error"
                              className="flex items-center gap-1 text-xs text-red-500"
                            >
                              <AlertCircle className="h-3 w-3" />
                              {errors.industry.message}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="customerType">Customer Type *</Label>
                          <Controller
                            name="customerType"
                            control={control}
                            render={({ field }) => (
                              <Select
                                value={field.value || ""}
                                onValueChange={(val) => {
                                  if (val) {
                                    field.onChange(val);
                                  }
                                }}
                              >
                                <SelectTrigger
                                  className="w-full max-w-m"
                                  id="customerType"
                                >
                                  <SelectValue placeholder="Select Customer Type" />
                                </SelectTrigger>
                                <SelectContent id="customerType-content">
                                  {allCustomerType &&
                                  allCustomerType.length > 0 ? (
                                    allCustomerType
                                      .filter(
                                        (type: CustomerType) =>
                                          typeof type.customerTypeId ===
                                            "string" &&
                                          type.customerTypeId.trim() !== ""
                                      )
                                      .map((type: CustomerType) => (
                                        <SelectItem
                                          key={type.customerTypeId}
                                          value={type.customerTypeId}
                                        >
                                          {type.typeName || "Unnamed Type"}
                                        </SelectItem>
                                      ))
                                  ) : (
                                    <div className="px-4 py-2 text-gray-500">
                                      No customer types found
                                    </div>
                                  )}
                                </SelectContent>
                              </Select>
                            )}
                          />
                          {errors.customerType && (
                            <p
                              id="customerType-error"
                              className="flex items-center gap-1 text-xs text-red-500"
                            >
                              <AlertCircle className="h-3 w-3" />
                              {errors.customerType.message}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="address">Street Address *</Label>
                          <Controller
                            name="address"
                            control={control}
                            render={({ field }) => (
                              <LocationAutoSearchBox
                                // Pass the field value and onChange handler from the Controller
                                value={field.value}
                                onValueChange={field.onChange}
                                onSelectLocation={(place) => {
                                  if (place) {
                                    // Set the other location-related fields
                                    form.setValue(
                                      "latitude",
                                      place.geometry?.location?.lat() ?? 0,
                                      { shouldValidate: true }
                                    );
                                    form.setValue(
                                      "longitude",
                                      place.geometry?.location?.lng() ?? 0,
                                      { shouldValidate: true }
                                    );

                                    let city = "";
                                    let state = "";
                                    let zipCode = "";
                                    let country = "";

                                    place.address_components?.forEach(
                                      (component) => {
                                        const types = component.types;
                                        if (types.includes("locality"))
                                          city = component.long_name;
                                        if (
                                          types.includes(
                                            "administrative_area_level_1"
                                          )
                                        )
                                          state = component.long_name;
                                        if (types.includes("postal_code"))
                                          zipCode = component.long_name;
                                        if (types.includes("country"))
                                          country = component.long_name;
                                      }
                                    );

                                    form.setValue("city", city, {
                                      shouldValidate: true,
                                    });
                                    form.setValue("state", state, {
                                      shouldValidate: true,
                                    });
                                    form.setValue("zipCode", zipCode, {
                                      shouldValidate: true,
                                    });
                                    form.setValue("country", country, {
                                      shouldValidate: true,
                                    });
                                  }
                                }}
                              />
                            )}
                          />
                          {/* The validation error message remains the same */}

                          {(errors.latitude ||
                            errors.longitude ||
                            errors.address) && (
                            <p
                              id="address-error"
                              className="flex items-center gap-1 text-xs text-red-500"
                            >
                              <AlertCircle className="h-3 w-3" />
                              {errors?.address?.message ||
                                "Please select a valid street address."}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="city">City *</Label>
                          <Controller
                            name="city"
                            control={control}
                            render={({ field }) => (
                              <Input
                                {...field}
                                id="city"
                                placeholder="Enter City"
                                aria-describedby={
                                  errors.city ? "city-error" : undefined
                                }
                              />
                            )}
                          />
                          {errors.city && (
                            <p
                              id="city-error"
                              className="flex items-center gap-1 text-xs text-red-500"
                            >
                              <AlertCircle className="h-3 w-3" />
                              {errors.city.message}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="state">State/Province *</Label>
                          <Controller
                            name="state"
                            control={control}
                            render={({ field }) => (
                              <Input
                                {...field}
                                id="state"
                                placeholder="Enter State/Province"
                                aria-describedby={
                                  errors.state ? "state-error" : undefined
                                }
                              />
                            )}
                          />
                          {errors.state && (
                            <p
                              id="state-error"
                              className="flex items-center gap-1 text-xs text-red-500"
                            >
                              <AlertCircle className="h-3 w-3" />
                              {errors.state.message}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="zipCode">ZIP/Postal Code *</Label>
                          <Controller
                            name="zipCode"
                            control={control}
                            render={({ field }) => (
                              <Input
                                {...field}
                                id="zipCode"
                                placeholder="Enter ZIP/Postal Code"
                                aria-describedby={
                                  errors.zipCode ? "zipCode-error" : undefined
                                }
                              />
                            )}
                          />
                          {errors.zipCode && (
                            <p
                              id="zipCode-error"
                              className="flex items-center gap-1 text-xs text-red-500"
                            >
                              <AlertCircle className="h-3 w-3" />
                              {errors.zipCode.message}
                            </p>
                          )}
                        </div>
                        <div className="space-y-3">
                          <Label htmlFor="country">Country *</Label>
                          <Controller
                            name="country"
                            control={control}
                            render={({ field }) => (
                              <Input
                                {...field}
                                id="country"
                                placeholder="Enter Country"
                                aria-describedby={
                                  errors.country ? "country-error" : undefined
                                }
                              />
                            )}
                          />
                          {errors.country && (
                            <p
                              id="country-error"
                              className="flex items-center gap-1 text-xs text-red-500"
                            >
                              <AlertCircle className="h-4 w-4" />
                              {errors.country.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 mt-3">
                      <Label htmlFor="notes">Additional Notes</Label>
                      <Controller
                        name="notes"
                        control={control}
                        render={({ field }) => (
                          <Textarea
                            {...field}
                            id="notes"
                            placeholder="Any additional information about the customer..."
                            rows={3}
                            aria-describedby={
                              errors.notes ? "notes-error" : undefined
                            }
                          />
                        )}
                      />
                      {errors.notes && (
                        <p
                          id="notes-error"
                          className="flex items-center gap-1 text-xs text-red-500"
                        >
                          <AlertCircle className="h-3 w-3" />
                          {errors.notes.message}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
                <Card className="mb-6">
                  <CardHeader className="flex flex-row items-center justify-between pb-0">
                    <CardTitle className="text-lg font-semibold">
                      Customer Contacts{" "}
                    </CardTitle>
                    <Button
                      type="button"
                      onClick={addNewContact}
                      variant="outline"
                      size="sm"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Contact
                    </Button>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {fields.map((contact, index) => (
                        <div
                          key={contact.id}
                          className="border rounded-lg p-4 space-y-3 bg-gray-50 relative"
                          style={{ minHeight: 260 }}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">
                                Contact {index + 1}
                              </span>
                              {contact.isPrimary && (
                                <span className="bg-black text-white text-xs px-2 py-1 rounded">
                                  Primary Contact
                                </span>
                              )}
                            </div>
                            <div className="flex items-center space-x-2">
                              <label className="flex items-center gap-2 cursor-pointer">
                                <span className="font-medium text-sm">
                                  Primary
                                </span>
                                <div className="relative inline-block">
                                  <input
                                    type="checkbox"
                                    id={`primary-contact-${contact.id}`}
                                    name={`primary-contact-${contact.id}`}
                                    checked={contact.isPrimary}
                                    onChange={() =>
                                      togglePrimaryContact(contact.id)
                                    }
                                    className="sr-only peer"
                                    tabIndex={-1}
                                    aria-label="Primary"
                                  />
                                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                                </div>
                              </label>
                              {fields.length > 1 && (
                                <Button
                                  type="button"
                                  onClick={() => remove(index)}
                                  variant="ghost"
                                  size="icon"
                                  className="text-red-500 hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                          <div className="border-t border-gray-200 -mx-4 max-w-m" />
                          {contact.isPrimary && (
                            <div className="rounded mb-4">
                              <Label htmlFor={`userRole-${index}`}>
                                Assigned Sales Rep
                              </Label>
                              <div className="flex gap-4 mt-2">
                                <Controller
                                  name={`contacts.${index}.userRole`}
                                  control={control}
                                  render={({ field }) => (
                                    <Select
                                      value={field.value || ""}
                                      onValueChange={async (val) => {
                                        if (val) {
                                          field.onChange(val);
                                          setSelectedRoleIds((prev) => ({
                                            ...prev,
                                            [contact.id]: val,
                                          }));
                                          setUsersPerContact((prev) => ({
                                            ...prev,
                                            [contact.id]: [],
                                          }));
                                          const assignedRepField =
                                            form.getValues(
                                              `contacts.${index}.assignedRep`
                                            );
                                          if (assignedRepField) {
                                            form.setValue(
                                              `contacts.${index}.assignedRep`,
                                              ""
                                            );
                                          }
                                          await loadUsersForContact(
                                            contact.id,
                                            val
                                          );
                                        }
                                      }}
                                    >
                                      <SelectTrigger
                                        className="w-full max-w-m"
                                        id={`userRole-${index}`}
                                      >
                                        <SelectValue placeholder="User Role" />
                                      </SelectTrigger>
                                      <SelectContent
                                        id={`userRole-content-${index}`}
                                        className="!w-full"
                                      >
                                        {roleOptions.length > 0 ? (
                                          roleOptions.map((option) => (
                                            <SelectItem
                                              key={option.value}
                                              value={String(option.value)}
                                            >
                                              {option.label}
                                            </SelectItem>
                                          ))
                                        ) : (
                                          <div className="px-4 py-2 text-gray-500">
                                            No roles found
                                          </div>
                                        )}
                                      </SelectContent>
                                    </Select>
                                  )}
                                />
                                <Controller
                                  name={`contacts.${index}.assignedRep`}
                                  control={control}
                                  render={({ field }) => (
                                    <Select
                                      value={field.value || ""}
                                      onValueChange={(val) => {
                                        if (val) {
                                          field.onChange(val);
                                        }
                                      }}
                                      disabled={
                                        !selectedRoleIds[contact.id] ||
                                        loadingUsersForContact[contact.id]
                                      }
                                    >
                                      <SelectTrigger
                                        className="w-full max-w-m"
                                        id={`assignedRep-${index}`}
                                      >
                                        <SelectValue
                                          placeholder={
                                            loadingUsersForContact[contact.id]
                                              ? "Loading..."
                                              : "User Assign"
                                          }
                                        />
                                      </SelectTrigger>
                                      <SelectContent
                                        id={`assignedRep-content-${index}`}
                                      >
                                        {usersPerContact[contact.id]?.length >
                                        0 ? (
                                          usersPerContact[contact.id].map(
                                            (user) => (
                                              <SelectItem
                                                key={user.id}
                                                value={String(user.id)}
                                              >
                                                {user.firstName +
                                                  " " +
                                                  user.lastName}
                                              </SelectItem>
                                            )
                                          )
                                        ) : (
                                          <div className="px-4 py-2 text-gray-500">
                                            {loadingUsersForContact[contact.id]
                                              ? "Loading users..."
                                              : "No users found for this role"}
                                          </div>
                                        )}
                                      </SelectContent>
                                    </Select>
                                  )}
                                />
                              </div>
                              {errors.contacts?.[index]?.userRole && (
                                <p className="flex items-center gap-1 text-xs text-red-500">
                                  <AlertCircle className="h-3 w-3" />
                                  {errors.contacts[index].userRole.message}
                                </p>
                              )}
                            </div>
                          )}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor={`contact-name-${index}`}>
                                Contact Name *
                              </Label>
                              <Controller
                                name={`contacts.${index}.name`}
                                control={control}
                                render={({ field }) => (
                                  <Input
                                    {...field}
                                    id={`contact-name-${index}`}
                                    placeholder="Enter Contact Name"
                                    aria-describedby={
                                      errors.contacts?.[index]?.name
                                        ? `contact-name-${index}-error`
                                        : undefined
                                    }
                                  />
                                )}
                              />
                              {errors.contacts?.[index]?.name && (
                                <p
                                  id={`contact-name-${index}-error`}
                                  className="flex items-center gap-1 text-xs text-red-500"
                                >
                                  <AlertCircle className="h-3 w-3" />
                                  {errors.contacts[index].name.message}
                                </p>
                              )}
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`contact-designation-${index}`}>
                                Designation
                              </Label>
                              <Controller
                                name={`contacts.${index}.designation`}
                                control={control}
                                render={({ field }) => (
                                  <Input
                                    {...field}
                                    id={`contact-designation-${index}`}
                                    placeholder="Enter Designation"
                                    aria-describedby={
                                      errors.contacts?.[index]?.designation
                                        ? `contact-designation-${index}-error`
                                        : undefined
                                    }
                                  />
                                )}
                              />
                              {errors.contacts?.[index]?.designation && (
                                <p
                                  id={`contact-designation-${index}-error`}
                                  className="flex items-center gap-1 text-xs text-red-500"
                                >
                                  <AlertCircle className="h-3 w-3" />
                                  {errors.contacts[index].designation.message}
                                </p>
                              )}
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`contact-email-${index}`}>
                                Email Address *
                              </Label>
                              <Controller
                                name={`contacts.${index}.email`}
                                control={control}
                                render={({ field }) => (
                                  <Input
                                    {...field}
                                    id={`contact-email-${index}`}
                                    type="email"
                                    placeholder="Enter Email Address"
                                    aria-describedby={
                                      errors.contacts?.[index]?.email
                                        ? `contact-email-${index}-error`
                                        : undefined
                                    }
                                  />
                                )}
                              />
                              {errors.contacts?.[index]?.email && (
                                <p
                                  id={`contact-email-${index}-error`}
                                  className="flex items-center gap-1 text-xs text-red-500"
                                >
                                  <AlertCircle className="h-3 w-3" />
                                  {errors.contacts[index].email.message}
                                </p>
                              )}
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`contact-phone-${index}`}>
                                Phone Number *
                              </Label>

                              <Controller
                                name={`contacts.${index}.phone`}
                                control={control}
                                render={({ field }) => (
                                  <Input
                                    {...field}
                                    id={`contact-phone-${index}`}
                                    type="tel"
                                    placeholder="Enter Phone Number"
                                    aria-describedby={
                                      errors.contacts?.[index]?.phone
                                        ? `contact-phone-${index}-error`
                                        : undefined
                                    }
                                  />
                                )}
                              />
                              {errors.contacts?.[index]?.phone && (
                                <p
                                  id={`contact-phone-${index}-error`}
                                  className="flex items-center gap-1 text-xs text-red-500"
                                >
                                  <AlertCircle className="h-3 w-3" />
                                  {errors.contacts[index].phone.message}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-end gap-2 pt-6">
                      <Button
                        className="px-8"
                        onClick={() => navigate({ to: "/customers" })}
                        variant={"outline"}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" className="px-8">
                        {isEditMode ? "Update" : "Save"}
                      </Button>
                    </div>
                    {submissionStatus === "success" && (
                      <div className="fixed top-4 right-4 bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 animate-in fade-in slide-in-from-top-5 duration-300 z-50">
                        <svg
                          className="w-5 h-5 text-green-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="font-medium">
                          {messageType === "draft"
                            ? "Draft saved successfully!"
                            : "Customer added successfully!"}
                        </span>
                      </div>
                    )}
                    {submissionStatus === "error" && (
                      <div className="fixed top-4 right-4 bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 animate-in fade-in slide-in-from-top-5 duration-300 z-50">
                        <svg
                          className="w-5 h-5 text-red-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="font-medium">
                          {messageType === "draft"
                            ? "Error saving draft. Please try again."
                            : "Error adding customer. Please try again."}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </form>
            </Form>
          </CardContent>
        </TabsContent>

        <TabsContent value="bulk" className="space-y-4">
          <CardContent>
            <BulkImport />
          </CardContent>
        </TabsContent>

        <TabsContent value="uploads" className="space-y-4">
          <CardContent>
            <UploadHistory />
          </CardContent>
        </TabsContent>
      </Tabs>
    </div>
  );
}
