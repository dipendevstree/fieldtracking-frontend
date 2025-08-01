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
  mobileFeaturesConfigFormSchema, 
  mobilePermissionFormSchema,
  mobileFeatureSettingsFormSchema,
  TMobileFeaturesConfigFormSchema,
  TMobilePermissionFormSchema,
  TMobileFeatureSettingsFormSchema 
} from '../data/schema'
import { MobileFeaturesConfig, MobilePermission, MobileFeatureSettings } from '../type/type'

// Mobile Features Configuration Action Form
interface MobileFeaturesConfigFormProps {
  currentConfig?: Partial<MobileFeaturesConfig>
  open: boolean
  onOpenChange: (open: boolean) => void
  loading?: boolean
  onSubmit: (values: TMobileFeaturesConfigFormSchema) => void
}

export function MobileFeaturesConfigActionForm({
  currentConfig,
  open,
  onOpenChange,
  onSubmit: onSubmitValues,
  loading,
}: MobileFeaturesConfigFormProps) {
  const isEdit = !!currentConfig

  const form = useForm<TMobileFeaturesConfigFormSchema>({
    resolver: zodResolver(mobileFeaturesConfigFormSchema),
    defaultValues: {
      scheduleAndReports: {
        allowScheduleViewing: currentConfig?.scheduleAndReports?.allowScheduleViewing ?? true,
        allowVisitSummaryAccess: currentConfig?.scheduleAndReports?.allowVisitSummaryAccess ?? true,
        allowExpenseReportAccess: currentConfig?.scheduleAndReports?.allowExpenseReportAccess ?? true,
      },
      cameraAndPhoto: {
        enableSelfieCheckin: currentConfig?.cameraAndPhoto?.enableSelfieCheckin ?? true,
        allowPhotoCapture: currentConfig?.cameraAndPhoto?.allowPhotoCapture ?? true,
        allowReceiptPhotos: currentConfig?.cameraAndPhoto?.allowReceiptPhotos ?? true,
        photoQuality: currentConfig?.cameraAndPhoto?.photoQuality ?? 'medium',
        maxPhotosPerVisit: currentConfig?.cameraAndPhoto?.maxPhotosPerVisit ?? 5,
      },
      offlineCapabilities: {
        enableOfflineMode: currentConfig?.offlineCapabilities?.enableOfflineMode ?? true,
        autoSyncWhenOnline: currentConfig?.offlineCapabilities?.autoSyncWhenOnline ?? true,
        syncFrequency: currentConfig?.offlineCapabilities?.syncFrequency ?? 15,
      },
    },
  })

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = form

  const onSubmit = (values: TMobileFeaturesConfigFormSchema) => {
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
              {isEdit ? 'Edit Mobile Features Configuration' : 'Configure Mobile Features'}
            </DialogTitle>
            <DialogDescription className='text-muted-foreground mt-1 text-sm'>
              {isEdit
                ? 'Update mobile app features configuration.'
                : 'Configure mobile app features and permissions.'}
            </DialogDescription>
          </div>
          <DialogClose asChild></DialogClose>
        </DialogHeader>

        <Form {...form}>
          <form
            id='mobile-features-config-form'
            onSubmit={handleSubmit(onSubmit)}
            className='space-y-6'
          >
            {/* Schedule & Reports Section */}
            <div className="space-y-4">
              <h4 className="text-lg font-medium">Schedule & Reports Access</h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="allowScheduleViewing">Allow Reps to View Their Schedule</Label>
                    <p className="text-sm text-muted-foreground">Enable schedule viewing in mobile app</p>
                  </div>
                  <Controller
                    name="scheduleAndReports.allowScheduleViewing"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="allowVisitSummaryAccess">Allow Visit Summary Access</Label>
                    <p className="text-sm text-muted-foreground">Enable viewing of visit history and summaries</p>
                  </div>
                  <Controller
                    name="scheduleAndReports.allowVisitSummaryAccess"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="allowExpenseReportAccess">Allow Expense Report Access</Label>
                    <p className="text-sm text-muted-foreground">Enable viewing and submitting expense reports</p>
                  </div>
                  <Controller
                    name="scheduleAndReports.allowExpenseReportAccess"
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
            </div>

            {/* Camera & Photo Section */}
            <div className="space-y-4">
              <h4 className="text-lg font-medium">Camera & Photo Features</h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enableSelfieCheckin">Enable Selfie Check-in</Label>
                    <p className="text-sm text-muted-foreground">Require selfie photos during check-in</p>
                  </div>
                  <Controller
                    name="cameraAndPhoto.enableSelfieCheckin"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="allowPhotoCapture">Allow Photo Capture</Label>
                    <p className="text-sm text-muted-foreground">Enable taking photos during visits</p>
                  </div>
                  <Controller
                    name="cameraAndPhoto.allowPhotoCapture"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="allowReceiptPhotos">Receipt Photo Capture</Label>
                    <p className="text-sm text-muted-foreground">Enable receipt photography for expenses</p>
                  </div>
                  <Controller
                    name="cameraAndPhoto.allowReceiptPhotos"
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="photoQuality">Photo Quality</Label>
                  <Controller
                    name="cameraAndPhoto.photoQuality"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select photo quality" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low (Faster upload)</SelectItem>
                          <SelectItem value="medium">Medium (Balanced)</SelectItem>
                          <SelectItem value="high">High (Best quality)</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.cameraAndPhoto?.photoQuality && (
                    <p className='flex items-center gap-1 text-xs text-red-500'>
                      <AlertCircle className='h-3 w-3' />
                      {errors.cameraAndPhoto.photoQuality.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxPhotosPerVisit">Max Photos per Visit</Label>
                  <Controller
                    name="cameraAndPhoto.maxPhotosPerVisit"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="maxPhotosPerVisit"
                        type="number"
                        placeholder="Enter max photos"
                        value={field.value || ''}
                      />
                    )}
                  />
                  {errors.cameraAndPhoto?.maxPhotosPerVisit && (
                    <p className='flex items-center gap-1 text-xs text-red-500'>
                      <AlertCircle className='h-3 w-3' />
                      {errors.cameraAndPhoto.maxPhotosPerVisit.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Offline Capabilities Section */}
            <div className="space-y-4">
              <h4 className="text-lg font-medium">Offline Capabilities</h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enableOfflineMode">Enable Offline Mode</Label>
                    <p className="text-sm text-muted-foreground">Allow app to work without internet connection</p>
                  </div>
                  <Controller
                    name="offlineCapabilities.enableOfflineMode"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="autoSyncWhenOnline">Auto-sync When Online</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically sync data when connection is restored
                    </p>
                  </div>
                  <Controller
                    name="offlineCapabilities.autoSyncWhenOnline"
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

              <div className="space-y-2">
                <Label htmlFor="syncFrequency">Sync Frequency (minutes)</Label>
                <Controller
                  name="offlineCapabilities.syncFrequency"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="syncFrequency"
                      type="number"
                      placeholder="Enter sync frequency"
                      value={field.value || ''}
                    />
                  )}
                />
                {errors.offlineCapabilities?.syncFrequency && (
                  <p className='flex items-center gap-1 text-xs text-red-500'>
                    <AlertCircle className='h-3 w-3' />
                    {errors.offlineCapabilities.syncFrequency.message}
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
          <CustomButton type='submit' loading={loading} form='mobile-features-config-form'>
            {isEdit ? 'Update Configuration' : 'Save Configuration'}
          </CustomButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Mobile Permission Action Form
interface MobilePermissionFormProps {
  currentPermission?: Partial<MobilePermission>
  open: boolean
  onOpenChange: (open: boolean) => void
  loading?: boolean
  onSubmit: (values: TMobilePermissionFormSchema) => void
}

export function MobilePermissionActionForm({
  currentPermission,
  open,
  onOpenChange,
  onSubmit: onSubmitValues,
  loading,
}: MobilePermissionFormProps) {
  const isEdit = !!currentPermission

  const form = useForm<TMobilePermissionFormSchema>({
    resolver: zodResolver(mobilePermissionFormSchema),
    defaultValues: {
      permissionName: currentPermission?.permissionName ?? '',
      isEnabled: currentPermission?.isEnabled ?? true,
      description: currentPermission?.description ?? '',
    },
  })

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = form

  const onSubmit = (values: TMobilePermissionFormSchema) => {
    onSubmitValues(values)
  }

  const handleDialogChange = (state: boolean) => {
    if (!state) reset()
    onOpenChange(state)
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className='max-h-[80vh] !max-w-md overflow-y-auto'>
        <DialogHeader className='flex flex-row items-center justify-between space-y-0 pb-4'>
          <div>
            <DialogTitle className='text-xl font-semibold'>
              {isEdit ? 'Edit Mobile Permission' : 'Add Mobile Permission'}
            </DialogTitle>
            <DialogDescription className='text-muted-foreground mt-1 text-sm'>
              {isEdit
                ? 'Update mobile app permission.'
                : 'Create a new mobile app permission.'}
            </DialogDescription>
          </div>
          <DialogClose asChild></DialogClose>
        </DialogHeader>

        <Form {...form}>
          <form
            id='mobile-permission-form'
            onSubmit={handleSubmit(onSubmit)}
            className='space-y-6'
          >
            {/* Permission Name Field */}
            <div className='space-y-2'>
              <Label htmlFor='permissionName'>Permission Name *</Label>
              <Controller
                name='permissionName'
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id='permissionName'
                    placeholder='Enter permission name'
                    value={field.value || ''}
                  />
                )}
              />
              {errors.permissionName && (
                <p className='flex items-center gap-1 text-xs text-red-500'>
                  <AlertCircle className='h-3 w-3' />
                  {errors.permissionName.message}
                </p>
              )}
            </div>

            {/* Description Field */}
            <div className='space-y-2'>
              <Label htmlFor='description'>Description</Label>
              <Controller
                name='description'
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    id='description'
                    placeholder='Enter description'
                    value={field.value || ''}
                  />
                )}
              />
            </div>

            {/* Is Enabled Field */}
            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <Label htmlFor='isEnabled'>Enabled</Label>
                <Controller
                  name='isEnabled'
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
          </form>
        </Form>
        
        <DialogFooter className='flex gap-2 pt-4'>
          <DialogClose asChild>
            <Button variant='outline'>Cancel</Button>
          </DialogClose>
          <CustomButton type='submit' loading={loading} form='mobile-permission-form'>
            {isEdit ? 'Update Permission' : 'Create Permission'}
          </CustomButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
