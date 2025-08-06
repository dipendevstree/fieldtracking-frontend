import { useEffect } from 'react'
import { DeleteModal } from '@/components/shared/common-delete-modal'
import {
  useCreateTrackingRule,
  useUpdateTrackingRule,
  useDeleteTrackingRule,
  useCreateGeofenceZone,
  useUpdateGeofenceZone,
  useDeleteGeofenceZone,
  TrackingRulePayload,
  GeofenceZonePayload
} from '../services/field-tracking.hook'
import { useFieldTrackingStore } from '../store/field-tracking.store'
import { TrackingRuleActionForm, GeofenceZoneActionForm } from './action-form'
import { TTrackingRuleFormSchema, TGeofenceZoneFormSchema } from '../data/schema'
import { toast } from 'sonner'

export function FieldTrackingActionModal() {
  const { 
    open, 
    setOpen, 
    currentRule, 
    setCurrentRule,
    currentZone,
    setCurrentZone
  } = useFieldTrackingStore()

  // Tracking Rule hooks
  const {
    mutate: createTrackingRule,
    isPending: isCreateRuleLoading,
    isSuccess: isCreateRuleSuccess,
    isError: isCreateRuleError,
  } = useCreateTrackingRule()

  const {
    mutate: updateTrackingRule,
    isPending: isUpdateRuleLoading,
    isSuccess: isUpdateRuleSuccess,
    isError: isUpdateRuleError,
  } = useUpdateTrackingRule(currentRule?.ruleId || '')

  const {
    mutate: deleteTrackingRule,
    isSuccess: isDeleteRuleSuccess,
    isError: isDeleteRuleError,
  } = useDeleteTrackingRule(currentRule?.ruleId || '')

  // Geofence Zone hooks
  const {
    mutate: createGeofenceZone,
    isPending: isCreateZoneLoading,
    isSuccess: isCreateZoneSuccess,
    isError: isCreateZoneError,
  } = useCreateGeofenceZone()

  const {
    mutate: updateGeofenceZone,
    isPending: isUpdateZoneLoading,
    isSuccess: isUpdateZoneSuccess,
    isError: isUpdateZoneError,
  } = useUpdateGeofenceZone(currentZone?.zoneId || '')

  const {
    mutate: deleteGeofenceZone,
    isSuccess: isDeleteZoneSuccess,
    isError: isDeleteZoneError,
  } = useDeleteGeofenceZone(currentZone?.zoneId || '')

  // Auto-close on successful operations
  useEffect(() => {
    if (
      (isCreateRuleSuccess && !isCreateRuleError) ||
      (isUpdateRuleSuccess && !isUpdateRuleError) ||
      (isDeleteRuleSuccess && !isDeleteRuleError) ||
      (isCreateZoneSuccess && !isCreateZoneError) ||
      (isUpdateZoneSuccess && !isUpdateZoneError) ||
      (isDeleteZoneSuccess && !isDeleteZoneError)
    ) {
      closeModal()
    }
  }, [
    isCreateRuleSuccess, isCreateRuleError,
    isUpdateRuleSuccess, isUpdateRuleError,
    isDeleteRuleSuccess, isDeleteRuleError,
    isCreateZoneSuccess, isCreateZoneError,
    isUpdateZoneSuccess, isUpdateZoneError,
    isDeleteZoneSuccess, isDeleteZoneError
  ])

  const closeModal = () => {
    setOpen(null)
    setTimeout(() => {
      setCurrentRule(null)
      setCurrentZone(null)
    }, 300)
  }

  // Tracking Rule handlers
  const handleCreateTrackingRule = (values: TTrackingRuleFormSchema) => {
    try {
      const payload: TrackingRulePayload = {
        ruleName: values.ruleName.trim(),
        ruleType: values.ruleType,
        isEnabled: values.isEnabled,
        conditions: values.conditions.map(condition => ({
          field: condition.field,
          operator: condition.operator,
          value: condition.value ?? ''
        })),
        actions: values.actions,
      }
      
      if (!payload.ruleName) {
        toast.error('Rule name is required')
        return
      }
      
      createTrackingRule(payload)
    } catch (error) {
      console.error('Error creating tracking rule:', error)
      toast.error('Failed to create tracking rule')
    }
  }

  const handleUpdateTrackingRule = (values: TTrackingRuleFormSchema) => {
    try {
      if (!currentRule?.ruleId) {
        toast.error('Rule ID is missing')
        return
      }
      
      const payload: TrackingRulePayload = {
        ruleName: values.ruleName.trim(),
        ruleType: values.ruleType,
        isEnabled: values.isEnabled,
        conditions: values.conditions.map(condition => ({
          field: condition.field,
          operator: condition.operator,
          value: condition.value ?? ''
        })),
        actions: values.actions,
      }
      
      if (!payload.ruleName) {
        toast.error('Rule name is required')
        return
      }
      
      updateTrackingRule(payload)
    } catch (error) {
      console.error('Error updating tracking rule:', error)
      toast.error('Failed to update tracking rule')
    }
  }

  const handleDeleteTrackingRule = () => {
    try {
      if (!currentRule?.ruleId) {
        toast.error('Rule ID is missing')
        return
      }
      
      deleteTrackingRule()
    } catch (error) {
      console.error('Error deleting tracking rule:', error)
      toast.error('Failed to delete tracking rule')
    }
  }

  // Geofence Zone handlers
  const handleCreateGeofenceZone = (values: TGeofenceZoneFormSchema) => {
    try {
      const payload: GeofenceZonePayload = {
        zoneName: values.zoneName.trim(),
        coordinates: values.coordinates,
        radius: values.radius,
        isActive: values.isActive,
        description: values.description?.trim(),
      }
      
      if (!payload.zoneName) {
        toast.error('Zone name is required')
        return
      }
      
      createGeofenceZone(payload)
    } catch (error) {
      console.error('Error creating geofence zone:', error)
      toast.error('Failed to create geofence zone')
    }
  }

  const handleUpdateGeofenceZone = (values: TGeofenceZoneFormSchema) => {
    try {
      if (!currentZone?.zoneId) {
        toast.error('Zone ID is missing')
        return
      }
      
      const payload: GeofenceZonePayload = {
        zoneName: values.zoneName.trim(),
        coordinates: values.coordinates,
        radius: values.radius,
        isActive: values.isActive,
        description: values.description?.trim(),
      }
      
      if (!payload.zoneName) {
        toast.error('Zone name is required')
        return
      }
      
      updateGeofenceZone(payload)
    } catch (error) {
      console.error('Error updating geofence zone:', error)
      toast.error('Failed to update geofence zone')
    }
  }

  const handleDeleteGeofenceZone = () => {
    try {
      if (!currentZone?.zoneId) {
        toast.error('Zone ID is missing')
        return
      }
      
      deleteGeofenceZone()
    } catch (error) {
      console.error('Error deleting geofence zone:', error)
      toast.error('Failed to delete geofence zone')
    }
  }

  return (
    <>
      {/* Tracking Rule Modals */}
      <TrackingRuleActionForm
        key='add-rule'
        open={open === 'add-rule'}
        loading={isCreateRuleLoading}
        onSubmit={handleCreateTrackingRule}
        onOpenChange={(value) => {
          if (!value) closeModal()
          else setOpen('add-rule')
        }}
      />

      {currentRule && (
        <>
          <TrackingRuleActionForm
            key='edit-rule'
            open={open === 'edit-rule'}
            loading={isUpdateRuleLoading}
            currentRow={currentRule}
            onSubmit={handleUpdateTrackingRule}
            onOpenChange={(value) => {
              if (!value) closeModal()
              else setOpen('edit-rule')
            }}
          />

          <DeleteModal
            key='delete-rule'
            open={open === 'delete-rule'}
            currentRow={currentRule}
            itemIdentifier={'ruleId' as keyof typeof currentRule}
            itemName='Tracking Rule'
            onDelete={handleDeleteTrackingRule}
            onOpenChange={(value) => {
              if (!value) closeModal()
              else setOpen('delete-rule')
            }}
          />
        </>
      )}

      {/* Geofence Zone Modals */}
      <GeofenceZoneActionForm
        key='add-zone'
        open={open === 'add-zone'}
        loading={isCreateZoneLoading}
        onSubmit={handleCreateGeofenceZone}
        onOpenChange={(value) => {
          if (!value) closeModal()
          else setOpen('add-zone')
        }}
      />

      {currentZone && (
        <>
          <GeofenceZoneActionForm
            key='edit-zone'
            open={open === 'edit-zone'}
            loading={isUpdateZoneLoading}
            currentRow={currentZone}
            onSubmit={handleUpdateGeofenceZone}
            onOpenChange={(value) => {
              if (!value) closeModal()
              else setOpen('edit-zone')
            }}
          />

          <DeleteModal
            key='delete-zone'
            open={open === 'delete-zone'}
            currentRow={currentZone}
            itemIdentifier={'zoneId' as keyof typeof currentZone}
            itemName='Geofence Zone'
            onDelete={handleDeleteGeofenceZone}
            onOpenChange={(value) => {
              if (!value) closeModal()
              else setOpen('delete-zone')
            }}
          />
        </>
      )}
    </>
  )
}
