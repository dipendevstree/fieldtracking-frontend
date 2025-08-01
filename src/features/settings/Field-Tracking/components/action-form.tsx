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
  trackingRuleFormSchema, 
  geofenceZoneFormSchema,
  TTrackingRuleFormSchema,
  TGeofenceZoneFormSchema 
} from '../data/schema'
import { TrackingRule, GeofenceZone } from '../type/type'

// Tracking Rule Action Form
interface TrackingRuleFormProps {
  currentRow?: Partial<TrackingRule>
  open: boolean
  onOpenChange: (open: boolean) => void
  loading?: boolean
  onSubmit: (values: TTrackingRuleFormSchema) => void
}

export function TrackingRuleActionForm({
  currentRow,
  open,
  onOpenChange,
  onSubmit: onSubmitValues,
  loading,
}: TrackingRuleFormProps) {
  const isEdit = !!currentRow

  const form = useForm<TTrackingRuleFormSchema>({
    resolver: zodResolver(trackingRuleFormSchema),
    defaultValues: {
      ruleName: currentRow?.ruleName ?? '',
      ruleType: currentRow?.ruleType ?? 'geofence',
      isEnabled: currentRow?.isEnabled ?? true,
      conditions: currentRow?.conditions ?? [],
      actions: currentRow?.actions ?? [],
    },
  })

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = form

  const onSubmit = (values: TTrackingRuleFormSchema) => {
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
              {isEdit ? 'Edit Tracking Rule' : 'Add Tracking Rule'}
            </DialogTitle>
            <DialogDescription className='text-muted-foreground mt-1 text-sm'>
              {isEdit
                ? 'Update tracking rule configuration.'
                : 'Create a new tracking rule.'}
            </DialogDescription>
          </div>
          <DialogClose asChild></DialogClose>
        </DialogHeader>

        <Form {...form}>
          <form
            id='tracking-rule-form'
            onSubmit={handleSubmit(onSubmit)}
            className='space-y-6'
          >
            {/* Rule Name Field */}
            <div className='space-y-2'>
              <Label htmlFor='ruleName'>Rule Name *</Label>
              <Controller
                name='ruleName'
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id='ruleName'
                    placeholder='Enter rule name'
                    value={field.value || ''}
                  />
                )}
              />
              {errors.ruleName && (
                <p className='flex items-center gap-1 text-xs text-red-500'>
                  <AlertCircle className='h-3 w-3' />
                  {errors.ruleName.message}
                </p>
              )}
            </div>

            {/* Rule Type Field */}
            <div className='space-y-2'>
              <Label htmlFor='ruleType'>Rule Type *</Label>
              <Controller
                name='ruleType'
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder='Select rule type' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='geofence'>Geofence</SelectItem>
                      <SelectItem value='idle'>Idle Time</SelectItem>
                      <SelectItem value='break'>Break Time</SelectItem>
                      <SelectItem value='route'>Route</SelectItem>
                      <SelectItem value='custom'>Custom</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.ruleType && (
                <p className='flex items-center gap-1 text-xs text-red-500'>
                  <AlertCircle className='h-3 w-3' />
                  {errors.ruleType.message}
                </p>
              )}
            </div>

            {/* Enabled Field */}
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
          <CustomButton type='submit' loading={loading} form='tracking-rule-form'>
            {isEdit ? 'Update Rule' : 'Create Rule'}
          </CustomButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Geofence Zone Action Form
interface GeofenceZoneFormProps {
  currentRow?: Partial<GeofenceZone>
  open: boolean
  onOpenChange: (open: boolean) => void
  loading?: boolean
  onSubmit: (values: TGeofenceZoneFormSchema) => void
}

export function GeofenceZoneActionForm({
  currentRow,
  open,
  onOpenChange,
  onSubmit: onSubmitValues,
  loading,
}: GeofenceZoneFormProps) {
  const isEdit = !!currentRow

  const form = useForm<TGeofenceZoneFormSchema>({
    resolver: zodResolver(geofenceZoneFormSchema),
    defaultValues: {
      zoneName: currentRow?.zoneName ?? '',
      coordinates: currentRow?.coordinates ?? { lat: 0, lng: 0 },
      radius: currentRow?.radius ?? 100,
      isActive: currentRow?.isActive ?? true,
      description: currentRow?.description ?? '',
    },
  })

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = form

  const onSubmit = (values: TGeofenceZoneFormSchema) => {
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
              {isEdit ? 'Edit Geofence Zone' : 'Add Geofence Zone'}
            </DialogTitle>
            <DialogDescription className='text-muted-foreground mt-1 text-sm'>
              {isEdit
                ? 'Update geofence zone configuration.'
                : 'Create a new geofence zone.'}
            </DialogDescription>
          </div>
          <DialogClose asChild></DialogClose>
        </DialogHeader>

        <Form {...form}>
          <form
            id='geofence-zone-form'
            onSubmit={handleSubmit(onSubmit)}
            className='space-y-6'
          >
            {/* Zone Name Field */}
            <div className='space-y-2'>
              <Label htmlFor='zoneName'>Zone Name *</Label>
              <Controller
                name='zoneName'
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id='zoneName'
                    placeholder='Enter zone name'
                    value={field.value || ''}
                  />
                )}
              />
              {errors.zoneName && (
                <p className='flex items-center gap-1 text-xs text-red-500'>
                  <AlertCircle className='h-3 w-3' />
                  {errors.zoneName.message}
                </p>
              )}
            </div>

            {/* Latitude Field */}
            <div className='space-y-2'>
              <Label htmlFor='lat'>Latitude *</Label>
              <Controller
                name='coordinates.lat'
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id='lat'
                    type='number'
                    step='any'
                    placeholder='Enter latitude'
                    value={field.value || ''}
                  />
                )}
              />
              {errors.coordinates?.lat && (
                <p className='flex items-center gap-1 text-xs text-red-500'>
                  <AlertCircle className='h-3 w-3' />
                  {errors.coordinates.lat.message}
                </p>
              )}
            </div>

            {/* Longitude Field */}
            <div className='space-y-2'>
              <Label htmlFor='lng'>Longitude *</Label>
              <Controller
                name='coordinates.lng'
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id='lng'
                    type='number'
                    step='any'
                    placeholder='Enter longitude'
                    value={field.value || ''}
                  />
                )}
              />
              {errors.coordinates?.lng && (
                <p className='flex items-center gap-1 text-xs text-red-500'>
                  <AlertCircle className='h-3 w-3' />
                  {errors.coordinates.lng.message}
                </p>
              )}
            </div>

            {/* Radius Field */}
            <div className='space-y-2'>
              <Label htmlFor='radius'>Radius (meters) *</Label>
              <Controller
                name='radius'
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id='radius'
                    type='number'
                    placeholder='Enter radius in meters'
                    value={field.value || ''}
                  />
                )}
              />
              {errors.radius && (
                <p className='flex items-center gap-1 text-xs text-red-500'>
                  <AlertCircle className='h-3 w-3' />
                  {errors.radius.message}
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

            {/* Active Field */}
            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <Label htmlFor='isActive'>Active</Label>
                <Controller
                  name='isActive'
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
          <CustomButton type='submit' loading={loading} form='geofence-zone-form'>
            {isEdit ? 'Update Zone' : 'Create Zone'}
          </CustomButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
