import { useState, useCallback } from 'react'
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '@/data/app.data'
import { cn } from '@/lib/utils'
import { Main } from '@/components/layout/main'
import { toast } from 'sonner'
import GeneralSettings from './components/GeneralSetting'
import { GeneralSettingsActionModal } from './components/action-form-modal'
import { useUpdateGeneralSettings } from './services/Generalhook'
import { useAuth } from '@/stores/use-auth-store'

const GeneralSettingsPage = () => {
  const { user, updateUser } = useAuth()
  const [_pagination, _setPagination] = useState({
    page: DEFAULT_PAGE_NUMBER,
    limit: DEFAULT_PAGE_SIZE,
  })

  const [currentSettingsData, setCurrentSettingsData] = useState<any>(null)

  // API hooks for updating data
  const organizationId = user?.organization?.organizationID
  const {
    mutate: updateGeneralSettings,
    isPending: isGeneralSettingsLoading,
  } = useUpdateGeneralSettings(organizationId)

  const isLoading = isGeneralSettingsLoading

  // Handle data changes from the component
  const handleDataChange = useCallback((data: any) => {
    setCurrentSettingsData(data)
  }, [])

  const handleSaveSettings = async () => {
    if (!currentSettingsData) {
      toast.error('No data to save')
      return
    }

    try {
      // Prepare payload that matches your API structure
      const organizationUpdatePayload = {
        organizationName: currentSettingsData.organizationName,
        industryId: currentSettingsData.industryId || "", // You may need to add this field
        organizationTypeId: currentSettingsData.organizationType,
        website: currentSettingsData.website,
        description: currentSettingsData.description,
        address: currentSettingsData.streetAddress,
        country: currentSettingsData.country,
        city: currentSettingsData.city,
        zipCode: currentSettingsData.zipCode,
        state: currentSettingsData.state,
        isActive: true,
        isAutoExpense: currentSettingsData.autoExpenseApproval,
        rsPerKm: currentSettingsData.autoExpenseApproval ? parseFloat(currentSettingsData.ratePerKm) || 0 : 0,
      }

      console.log('Organization update payload:', organizationUpdatePayload)

      // Update organization data
      await new Promise((resolve, reject) => {
        updateGeneralSettings(organizationUpdatePayload, {
          onSuccess: () => {
            // Update the user data in the auth store with the new organization data
            if (user && user.organization) {
              const updatedOrganization = {
                ...user.organization,
                organizationName: currentSettingsData.organizationName,
                organizationTypeId: currentSettingsData.organizationType,
                industryId: currentSettingsData.industryId || "",
                website: currentSettingsData.website,
                description: currentSettingsData.description,
                address: currentSettingsData.streetAddress,
                country: currentSettingsData.country,
                city: currentSettingsData.city,
                zipCode: currentSettingsData.zipCode,
                state: currentSettingsData.state,
                isAutoExpense: currentSettingsData.autoExpenseApproval,
                rsPerKm: currentSettingsData.autoExpenseApproval ? parseFloat(currentSettingsData.ratePerKm) || 0 : 0,
              }

              console.log('Updating organization in auth store:', updatedOrganization)
              updateUser({
                organization: updatedOrganization
              })
              console.log('Organization updated in auth store successfully')
            }
            resolve(true)
          },
          onError: reject,
        })
      })

      toast.success('Settings updated successfully!')
      
      // Clear the current settings data to force a refresh
      setCurrentSettingsData(null)
      
    } catch (error) {
      console.error('Error updating settings:', error)
      toast.error('Failed to update settings. Please try again.')
    }
  }
    
  return (
    <Main className={cn('flex flex-col gap-2 p-4')}>
      
      {/* General Settings Configuration Section */}
      <div className='mt-6'>
        <div className="mb-6">
          <h1 className="text-2xl font-bold">General Application Settings</h1>
          <p className="text-muted-foreground">
            Configure general application preferences and system settings.
          </p>
        </div>

        {/* Settings Configuration */}
        <div className="mb-2">
          <GeneralSettings onDataChange={handleDataChange} />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <button
            onClick={handleSaveSettings}
            disabled={isLoading || !currentSettingsData}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed">
            {isLoading ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
      <GeneralSettingsActionModal key={'general-settings-action-modal'} />
    </Main>
  )
}

export default GeneralSettingsPage
