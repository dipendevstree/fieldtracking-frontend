import { Main } from "@/components/layout/main";
import CustomFileUploadInputMemo from "@/components/shared/custom-file-upload-input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { jsonToFormData } from "@/utils/commonFunction";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "@tanstack/react-router";
import { AlertCircle, Building2, CheckCircle, Clock, CreditCard, Eye, EyeOff, Globe, ImageIcon, Mail, MapPin, Phone, Settings, User } from "lucide-react";
import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useCreateMerchant } from "../services/merchants.hook";
import { dayNames, defaultValues, MerchantFormData, merchantSchema } from "./schema";



const MerchantForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { navigate } = useRouter();

  const { control, handleSubmit, formState: { errors }, watch } = useForm({
    resolver: zodResolver(merchantSchema),
    defaultValues: defaultValues,
    mode: "onChange",
  });

  const formData = watch();

  const { mutate: createMerchant, isPending: loading } = useCreateMerchant(() => {
    navigate({ to: '/merchants' });
  });

  const onSubmit: SubmitHandler<MerchantFormData> = async (data) => {
    const payloadData = {
      ...data,
      working_hours: JSON.stringify(data.working_hours),
    };
    const payloadFormData = jsonToFormData(payloadData);
    createMerchant(payloadFormData);
  };

  return (
    <Main className="space-y-6">
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Merchant Registration</h1>
        <p className="text-gray-600 mt-2">Please fill out all required fields to register your merchant account.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Personal Information */}
        <Card className="shadow border-0 bg-white/80 backdrop-blur-sm mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-6 h-6 text-blue-600" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name *</Label>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="name"
                      {...field}
                      placeholder="John Doe"
                      className={`transition-all duration-200 ${errors.name ? 'border-red-500 focus:border-red-500' : 'focus:border-blue-500'}`}
                    />
                  )}
                />
                {errors.name && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="user_name" className="text-sm font-medium text-gray-700">Username *</Label>
                <Controller
                  name="user_name"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="user_name"
                      {...field}
                      placeholder="merchant123"
                      className={`transition-all duration-200 ${errors.user_name ? 'border-red-500 focus:border-red-500' : 'focus:border-blue-500'}`}
                    />
                  )}
                />
                {errors.user_name && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.user_name.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="email"
                        type="email"
                        {...field}
                        placeholder="merchant@example.com"
                        className={`pl-10 transition-all duration-200 ${errors.email ? 'border-red-500 focus:border-red-500' : 'focus:border-blue-500'}`}
                      />
                    )}
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobile" className="text-sm font-medium text-gray-700">Mobile Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Controller
                    name="mobile"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="mobile"
                        {...field}
                        placeholder="+1234567890"
                        className="pl-10 transition-all duration-200 focus:border-blue-500"
                      />
                    )}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password *</Label>
                <div className="relative">
                  <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        {...field}
                        placeholder="Enter secure password"
                        className={`pr-10 transition-all duration-200 ${errors.password ? 'border-red-500 focus:border-red-500' : 'focus:border-blue-500'}`}
                      />
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.password.message}</p>}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Gender</Label>
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="transition-all duration-200 focus:border-blue-500">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Business Details */}
        <Card className="shadow border-0 bg-white/80 backdrop-blur-sm mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-6 h-6 text-green-600" />
              Business Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="merchant_id" className="text-sm font-medium text-gray-700">Merchant ID *</Label>
                <Controller
                  name="merchant_id"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="merchant_id"
                      {...field}
                      placeholder="MRC123456"
                      className={`transition-all duration-200 ${errors.merchant_id ? 'border-red-500 focus:border-red-500' : 'focus:border-blue-500'}`}
                    />
                  )}
                />
                {errors.merchant_id && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.merchant_id.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="tax_id" className="text-sm font-medium text-gray-700">Tax ID</Label>
                <Controller
                  name="tax_id"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="tax_id"
                      {...field}
                      placeholder="TAX123456"
                      className="transition-all duration-200 focus:border-blue-500"
                    />
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="support_email" className="text-sm font-medium text-gray-700">Support Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Controller
                    name="support_email"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="support_email"
                        type="email"
                        {...field}
                        placeholder="support@example.com"
                        className={`pl-10 transition-all duration-200 ${errors.support_email ? 'border-red-500 focus:border-red-500' : 'focus:border-blue-500'}`}
                      />
                    )}
                  />
                </div>
                {errors.support_email && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.support_email.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency" className="text-sm font-medium text-gray-700">Currency</Label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Controller
                    name="currency"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="currency"
                        {...field}
                        placeholder="USD"
                        className="pl-10 transition-all duration-200 focus:border-blue-500"
                      />
                    )}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Business Plan</Label>
                <Controller
                  name="plan"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="transition-all duration-200 focus:border-blue-500">
                        <SelectValue placeholder="Select plan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Basic">Basic</SelectItem>
                        <SelectItem value="Pro">Pro</SelectItem>
                        <SelectItem value="Enterprise">Enterprise</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry_type" className="text-sm font-medium text-gray-700">Industry Type</Label>
                <Controller
                  name="industry_type"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="industry_type"
                      {...field}
                      placeholder="e.g., Retail, Restaurant, Services"
                      className="transition-all duration-200 focus:border-blue-500"
                    />
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Address Information */}
        <Card className="shadow border-0 bg-white/80 backdrop-blur-sm mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-6 h-6 text-purple-600" />
              Address Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="address" className="text-sm font-medium text-gray-700">Street Address</Label>
                <Controller
                  name="address"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="address"
                      {...field}
                      placeholder="123 Main Street, Suite 100"
                      className="transition-all duration-200 focus:border-blue-500"
                    />
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city" className="text-sm font-medium text-gray-700">City</Label>
                <Controller
                  name="city"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="city"
                      {...field}
                      placeholder="New York"
                      className="transition-all duration-200 focus:border-blue-500"
                    />
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state" className="text-sm font-medium text-gray-700">State</Label>
                <Controller
                  name="state"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="state"
                      {...field}
                      placeholder="NY"
                      className="transition-all duration-200 focus:border-blue-500"
                    />
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="zip_code" className="text-sm font-medium text-gray-700">Zip/Postal Code</Label>
                <Controller
                  name="zip_code"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="zip_code"
                      {...field}
                      placeholder="10001"
                      className="transition-all duration-200 focus:border-blue-500"
                    />
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country" className="text-sm font-medium text-gray-700">Country</Label>
                <Controller
                  name="country"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="country"
                      {...field}
                      placeholder="United States"
                      className="transition-all duration-200 focus:border-blue-500"
                    />
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Online Presence */}
        <Card className="shadow border-0 bg-white/80 backdrop-blur-sm mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-6 h-6 text-orange-600" />
              Online Presence
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="online_store_url" className="text-sm font-medium text-gray-700">Online Store URL</Label>
                <Controller
                  name="online_store_url"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="online_store_url"
                      {...field}
                      placeholder="https://store.example.com"
                      className="transition-all duration-200 focus:border-blue-500"
                    />
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="invoice_public_url" className="text-sm font-medium text-gray-700">Invoice Public URL</Label>
                <Controller
                  name="invoice_public_url"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="invoice_public_url"
                      {...field}
                      placeholder="https://invoice.example.com"
                      className="transition-all duration-200 focus:border-blue-500"
                    />
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="instagram" className="text-sm font-medium text-gray-700">Instagram Handle</Label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-400 text-sm">@</span>
                  <Controller
                    name="instagram"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="instagram"
                        {...field}
                        placeholder="yourbusiness"
                        className="pl-8 transition-all duration-200 focus:border-blue-500"
                      />
                    )}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="facebook" className="text-sm font-medium text-gray-700">Facebook Page</Label>
                <Controller
                  name="facebook"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="facebook"
                      {...field}
                      placeholder="facebook.com/yourbusiness"
                      className="transition-all duration-200 focus:border-blue-500"
                    />
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="twitter" className="text-sm font-medium text-gray-700">Twitter Handle</Label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-400 text-sm">@</span>
                  <Controller
                    name="twitter"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="twitter"
                        {...field}
                        placeholder="yourbusiness"
                        className="pl-8 transition-all duration-200 focus:border-blue-500"
                      />
                    )}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsapp" className="text-sm font-medium text-gray-700">WhatsApp Business</Label>
                <Controller
                  name="whatsapp"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="whatsapp"
                      {...field}
                      placeholder="+1234567890"
                      className="transition-all duration-200 focus:border-blue-500"
                    />
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Details */}
        <Card className="shadow border-0 bg-white/80 backdrop-blur-sm mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-6 h-6 text-red-600" />
              Additional Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="doing_business_as" className="text-sm font-medium text-gray-700">Doing Business As (DBA)</Label>
                <Controller
                  name="doing_business_as"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="doing_business_as"
                      {...field}
                      placeholder="Your Business Name"
                      className="transition-all duration"
                    />
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="desktop_name" className="text-sm font-medium text-gray-700">Desktop Application Name</Label>
                <Controller
                  name="desktop_name"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="desktop_name"
                      {...field}
                      placeholder="Business POS System"
                      className="transition-all duration"
                    />
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nif" className="text-sm font-medium text-gray-700">Tax Identification Number (NIF)</Label>
                <Controller
                  name="nif"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="nif"
                      {...field}
                      placeholder="NIF98765"
                      className="transition-all duration"
                    />
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reg_dgii" className="text-sm font-medium text-gray-700">DGII Registration</Label>
                <Controller
                  name="reg_dgii"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="reg_dgii"
                      {...field}
                      placeholder="REG123456"
                      className="transition-all duration"
                    />
                  )}
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="description" className="text-sm font-medium text-gray">Business Description</Label>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      id="description"
                      {...field}
                      placeholder="Tell us about your business, what you do, and what makes you unique..."
                      className="transition-all duration-200 focus:ring-blue-500 min-h-[100px]"
                    />
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Working Hours */}
        <Card className="shadow border-0 bg-white/80 backdrop-blur-sm mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-6 h-6 text-indigo-600" />
              Working Hours
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-600">
            <div className="space-y-4">
              {formData.working_hours.map((hour, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Day</Label>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{dayNames[hour.day]}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`start_time_${index}`} className="text-sm font-medium text-gray-700">Start Time</Label>
                      <Controller
                        name={`working_hours.${index}.start_time` as const}
                        control={control}
                        render={({ field }) => (
                          <Input
                            type="time"
                            {...field}
                            disabled={hour.is_closed}
                            className="transition-all duration-200 focus:ring-blue-500" />
                        )}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`end_time_${index}`} className="text-sm font-medium text-gray-700">End Time</Label>
                      <Controller
                        name={`working_hours.${index}.end_time` as const}
                        control={control}
                        render={({ field }) => (
                          <Input
                            type="time"
                            {...field}
                            disabled={hour.is_closed}
                            className="transition-all duration-200 focus:ring-blue-500"
                          />
                        )}
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Controller
                        name={`working_hours.${index}.is_closed` as const}
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            id={`closed-${index}`}
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        )}
                      />
                      <Label htmlFor={`closed-${index}`} className="text-sm font-medium text-gray-700">
                        Closed
                      </Label>
                    </div>
                  </div>
                </div>
              ))
              }
            </div >
          </CardContent >
        </Card>

        {/* Images */}
        <Card className="shadow border-0 bg-white/80 backdrop-blur-sm mb-6" >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="w-6 h-6 text-teal-600" />
              Images
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <CustomFileUploadInputMemo
                  name="signature_image"
                  label="Signature Image"
                  loading={loading}
                  control={control}
                />
                {errors.signature_image && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.signature_image.message}</p>}
              </div>

              <div className="space-y-2">
                <CustomFileUploadInputMemo
                  name="store_theme_background_image"
                  label="Store Theme Background Image"
                  loading={loading}
                  control={control}
                />
                {errors.store_theme_background_image && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.store_theme_background_image.message}</p>}
              </div>

              <div className="space-y-2">
                <CustomFileUploadInputMemo
                  name="store_background_image"
                  label="Store Background Image"
                  loading={loading}
                  control={control}
                />
                {errors.store_background_image && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.store_background_image.message}</p>}
              </div>

              <div className="space-y-2">
                <CustomFileUploadInputMemo
                  name="logo_image"
                  label="Logo Image"
                  loading={loading}
                  control={control}
                />
                {errors.logo_image && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.logo_image.message}</p>}
              </div>

              <div className="space-y-2">
                <CustomFileUploadInputMemo
                  name="profile_picture"
                  label="Profile Picture"
                  loading={loading}
                  control={control}
                />
                {errors.profile_picture && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.profile_picture.message}</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 transition-all duration-200"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                Submit
              </>
            )}
          </Button>
        </div>
      </form>
    </Main>
  );
};

export default MerchantForm;
