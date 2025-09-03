import { Controller, useForm } from 'react-hook-form'
import { DialogClose, DialogDescription } from '@radix-ui/react-dialog'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Form } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import CustomButton from '@/components/shared/custom-button'
import { 
  generalSettingsFormSchema, 
  companyInfoFormSchema,
  TGeneralSettingsFormSchema,
  TCompanyInfoFormSchema
} from '../data/schema'
import { GeneralSettings, CompanyInfo } from '../type/type'

// General Settings Action Form
interface GeneralSettingsFormProps {
  currentSettings?: Partial<GeneralSettings>
  open: boolean
  onOpenChange: (open: boolean) => void
  loading?: boolean
  onSubmit: (values: TGeneralSettingsFormSchema) => void
}

export function GeneralSettingsActionForm({
  currentSettings,
  open,
  onOpenChange,
  onSubmit: onSubmitValues,
  loading,
}: GeneralSettingsFormProps) {
  const isEdit = !!currentSettings

  const form = useForm<TGeneralSettingsFormSchema>({
    resolver: zodResolver(generalSettingsFormSchema),
    defaultValues: {
      companyInformation: {
        companyName: currentSettings?.companyInformation?.companyName ?? '',
        defaultTimezone: currentSettings?.companyInformation?.defaultTimezone ?? 'est',
      },
      currencyAndFormatting: {
        defaultCurrency: currentSettings?.currencyAndFormatting?.defaultCurrency ?? 'usd',
        dateFormat: currentSettings?.currencyAndFormatting?.dateFormat ?? 'mm-dd-yyyy',
        distanceUnit: currentSettings?.currencyAndFormatting?.distanceUnit ?? 'miles',
      },
      securitySettings: {
        requireTwoFactorAuth: currentSettings?.securitySettings?.requireTwoFactorAuth ?? false,
        autoLogoutOnInactivity: currentSettings?.securitySettings?.autoLogoutOnInactivity ?? true,
        sessionTimeoutMinutes: currentSettings?.securitySettings?.sessionTimeoutMinutes ?? 30,
      },
    },
  })

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = form

  const onSubmit = (values: TGeneralSettingsFormSchema) => {
    onSubmitValues(values)
  }

  const handleDialogChange = (state: boolean) => {
    if (!state) reset()
    onOpenChange(state)
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className='max-h-[80vh] !max-w-2xl overflow-y-auto'>
        <DialogHeader className='flex flex-row items-center justify-between space-y-0 pb-4'>
          <div>
            <DialogTitle className='text-xl font-semibold'>
              {isEdit ? 'Save' : 'Configure General Settings'}
            </DialogTitle>
            <DialogDescription className='text-muted-foreground mt-1 text-sm'>
              {isEdit
                ? 'Update general application settings.'
                : 'Configure general application settings.'}
            </DialogDescription>
          </div>
          <DialogClose asChild></DialogClose>
        </DialogHeader>

        <Form {...form}>
          <form
            id='general-settings-form'
            onSubmit={handleSubmit(onSubmit)}
            className='space-y-6'
          >
            {/* Company Information Section */}
            <div className='space-y-4'>
              <h4 className='text-lg font-medium'>Company Information</h4>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='companyName'>Company Name <span className="text-red-500">*</span></Label>
                  <Controller
                    name='companyInformation.companyName'
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id='companyName'
                        placeholder='Enter company name'
                        value={field.value || ''}
                      />
                    )}
                  />
                  {errors.companyInformation?.companyName && (
                    <p className='flex items-center gap-1 text-xs text-red-500'>
                      <AlertCircle className='h-3 w-3' />
                      {errors.companyInformation.companyName.message}
                    </p>
                  )}
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='defaultTimezone'>Default Timezone <span className="text-red-500">*</span></Label>
                  <Controller
                    name='companyInformation.defaultTimezone'
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder='Select timezone' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='est'>Eastern Time (EST)</SelectItem>
                          <SelectItem value='cst'>Central Time (CST)</SelectItem>
                          <SelectItem value='mst'>Mountain Time (MST)</SelectItem>
                          <SelectItem value='pst'>Pacific Time (PST)</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.companyInformation?.defaultTimezone && (
                    <p className='flex items-center gap-1 text-xs text-red-500'>
                      <AlertCircle className='h-3 w-3' />
                      {errors.companyInformation.defaultTimezone.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Currency & Formatting Section */}
            <div className='space-y-4'>
              <h4 className='text-lg font-medium'>Currency & Formatting</h4>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='defaultCurrency'>Default Currency <span className="text-red-500">*</span></Label>
                  <Controller
                    name='currencyAndFormatting.defaultCurrency'
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder='Select currency' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='usd'>USD ($)</SelectItem>
                          <SelectItem value='eur'>EUR (€)</SelectItem>
                          <SelectItem value='gbp'>GBP (£)</SelectItem>
                          <SelectItem value='cad'>CAD (C$)</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.currencyAndFormatting?.defaultCurrency && (
                    <p className='flex items-center gap-1 text-xs text-red-500'>
                      <AlertCircle className='h-3 w-3' />
                      {errors.currencyAndFormatting.defaultCurrency.message}
                    </p>
                  )}
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='dateFormat'>Date Format <span className="text-red-500">*</span></Label>
                  <Controller
                    name='currencyAndFormatting.dateFormat'
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder='Select date format' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='mm-dd-yyyy'>MM/DD/YYYY</SelectItem>
                          <SelectItem value='dd-mm-yyyy'>DD/MM/YYYY</SelectItem>
                          <SelectItem value='yyyy-mm-dd'>YYYY-MM-DD</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.currencyAndFormatting?.dateFormat && (
                    <p className='flex items-center gap-1 text-xs text-red-500'>
                      <AlertCircle className='h-3 w-3' />
                      {errors.currencyAndFormatting.dateFormat.message}
                    </p>
                  )}
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='distanceUnit'>Distance Unit <span className="text-red-500">*</span></Label>
                  <Controller
                    name='currencyAndFormatting.distanceUnit'
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder='Select distance unit' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='miles'>Miles</SelectItem>
                          <SelectItem value='kilometers'>Kilometers</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.currencyAndFormatting?.distanceUnit && (
                    <p className='flex items-center gap-1 text-xs text-red-500'>
                      <AlertCircle className='h-3 w-3' />
                      {errors.currencyAndFormatting.distanceUnit.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Security Settings Section */}
            <div className='space-y-4'>
              <h4 className='text-lg font-medium'>Security Settings</h4>
              <div className='space-y-3'>
                <div className='flex items-center justify-between'>
                  <div>
                    <Label htmlFor='requireTwoFactorAuth'>Require Two-Factor Authentication</Label>
                    <p className='text-sm text-muted-foreground'>Enforce 2FA for all users</p>
                  </div>
                  <Controller
                    name='securitySettings.requireTwoFactorAuth'
                    control={control}
                    render={({ field }) => (
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                </div>
                <div className='flex items-center justify-between'>
                  <div>
                    <Label htmlFor='autoLogoutOnInactivity'>Auto-logout on Inactivity</Label>
                    <p className='text-sm text-muted-foreground'>Automatically log out inactive users</p>
                  </div>
                  <Controller
                    name='securitySettings.autoLogoutOnInactivity'
                    control={control}
                    render={({ field }) => (
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                </div>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='sessionTimeoutMinutes'>Session Timeout (minutes) <span className="text-red-500">*</span></Label>
                <Controller
                  name='securitySettings.sessionTimeoutMinutes'
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id='sessionTimeoutMinutes'
                      type='number'
                      placeholder='Enter timeout in minutes'
                      value={field.value || ''}
                      className='w-32'
                    />
                  )}
                />
                {errors.securitySettings?.sessionTimeoutMinutes && (
                  <p className='flex items-center gap-1 text-xs text-red-500'>
                    <AlertCircle className='h-3 w-3' />
                    {errors.securitySettings.sessionTimeoutMinutes.message}
                  </p>
                )}
              </div>
            </div>
          </form>
        </Form>
        
        <DialogFooter className='flex gap-2 pt-4'>
          <DialogClose asChild>
            <Button variant='outline'>Cancel</Button>
          </DialogClose>
          <CustomButton type='submit' loading={loading} form='general-settings-form'>
            {isEdit ? 'Update Settings' : 'Save Settings'}
          </CustomButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Company Information Action Form
interface CompanyInfoFormProps {
  currentCompanyInfo?: Partial<CompanyInfo>
  open: boolean
  onOpenChange: (open: boolean) => void
  loading?: boolean
  onSubmit: (values: TCompanyInfoFormSchema) => void
}

export function CompanyInfoActionForm({
  currentCompanyInfo,
  open,
  onOpenChange,
  onSubmit: onSubmitValues,
  loading,
}: CompanyInfoFormProps) {
  const isEdit = !!currentCompanyInfo

  const form = useForm<TCompanyInfoFormSchema>({
    resolver: zodResolver(companyInfoFormSchema),
    defaultValues: {
      companyName: currentCompanyInfo?.companyName ?? '',
      defaultTimezone: currentCompanyInfo?.defaultTimezone ?? 'est',
      contactEmail: currentCompanyInfo?.contactEmail ?? '',
      contactPhone: currentCompanyInfo?.contactPhone ?? '',
      address: currentCompanyInfo?.address ?? '',
      website: currentCompanyInfo?.website ?? '',
    },
  })

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = form

  const onSubmit = (values: TCompanyInfoFormSchema) => {
    onSubmitValues(values)
  }

  const handleDialogChange = (state: boolean) => {
    if (!state) reset()
    onOpenChange(state)
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className='max-h-[80vh] !max-w-md overflow-y-auto'>
        <Form {...form}>
          <form
            id='company-info-form'
            onSubmit={handleSubmit(onSubmit)}
            className='space-y-6'
          >
            {/* Company Name Field */}
            <div className='space-y-2'>
              <Label htmlFor='companyName'>Company Name <span className="text-red-500">*</span></Label>
              <Controller
                name='companyName'
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id='companyName'
                    placeholder='Enter company name'
                    value={field.value || ''}
                  />
                )}
              />
              {errors.companyName && (
                <p className='flex items-center gap-1 text-xs text-red-500'>
                  <AlertCircle className='h-3 w-3' />
                  {errors.companyName.message}
                </p>
              )}
            </div>

            {/* Default Timezone Field */}
            <div className='space-y-2'>
              <Label htmlFor='defaultTimezone'>Default Timezone <span className="text-red-500">*</span></Label>
              <Controller
                name='defaultTimezone'
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder='Select timezone' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='est'>Eastern Time (EST)</SelectItem>
                      <SelectItem value='cst'>Central Time (CST)</SelectItem>
                      <SelectItem value='mst'>Mountain Time (MST)</SelectItem>
                      <SelectItem value='pst'>Pacific Time (PST)</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.defaultTimezone && (
                <p className='flex items-center gap-1 text-xs text-red-500'>
                  <AlertCircle className='h-3 w-3' />
                  {errors.defaultTimezone.message}
                </p>
              )}
            </div>

            {/* Contact Email Field */}
            <div className='space-y-2'>
              <Label htmlFor='contactEmail'>Contact Email</Label>
              <Controller
                name='contactEmail'
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id='contactEmail'
                    type='email'
                    placeholder='Enter contact email'
                    value={field.value || ''}
                  />
                )}
              />
              {errors.contactEmail && (
                <p className='flex items-center gap-1 text-xs text-red-500'>
                  <AlertCircle className='h-3 w-3' />
                  {errors.contactEmail.message}
                </p>
              )}
            </div>

            {/* Contact Phone Field */}
            <div className='space-y-2'>
              <Label htmlFor='contactPhone'>Contact Phone <span className="text-red-500">*</span></Label>
              <Controller
                name='contactPhone'
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id='contactPhone'
                    placeholder='Enter contact phone number'
                    value={field.value || ''}
                  />
                )}
              />
              {errors.contactPhone && (
                <p className='flex items-center gap-1 text-xs text-red-500'>
                  <AlertCircle className='h-3 w-3' />
                  {errors.contactPhone.message}
                </p>
              )}
            </div>

            {/* Address Field */}
            <div className='space-y-2'>
              <Label htmlFor='address'>Address <span className="text-red-500">*</span></Label>
              <Controller
                name='address'
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    id='address'
                    placeholder='Enter complete company address'
                    value={field.value || ''}
                  />
                )}
              />
              {errors.address && (
                <p className='flex items-center gap-1 text-xs text-red-500'>
                  <AlertCircle className='h-3 w-3' />
                  {errors.address.message}
                </p>
              )}
            </div>

            {/* Website Field */}
            <div className='space-y-2'>
              <Label htmlFor='website'>Website <span className="text-red-500">*</span></Label>
              <Controller
                name='website'
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id='website'
                    type='url'
                    placeholder='Enter website URL'
                    value={field.value || ''}
                  />
                )}
              />
              {errors.website && (
                <p className='flex items-center gap-1 text-xs text-red-500'>
                  <AlertCircle className='h-3 w-3' />
                  {errors.website.message}
                </p>
              )}
            </div>
          </form>
        </Form>
        
        <DialogFooter className='flex gap-2 pt-4'>
          <DialogClose asChild>
            <Button variant='outline'>Cancel</Button>
          </DialogClose>
          <CustomButton type='submit' loading={loading} form='company-info-form'>
            {isEdit ? 'Update Company Info' : 'Save Company Info'}
          </CustomButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
