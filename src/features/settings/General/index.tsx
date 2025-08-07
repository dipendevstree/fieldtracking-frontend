import { useState } from 'react'
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '@/data/app.data'
import { cn } from '@/lib/utils'
import { Main } from '@/components/layout/main'

// import { useGetGeneralSettingsData } from './services/Generalhook'
// import { useGeneralSettingsStore } from './store/customer-type.store'
// import { ErrorPage } from '@/components/shared/custom-error'
import GeneralSettings from './components/GeneralSetting'
import { GeneralSettingsActionModal } from './components/action-form-modal'

const GeneralSettingsPage = () => {
  const [_pagination, _setPagination] = useState({
    page: DEFAULT_PAGE_NUMBER,
    limit: DEFAULT_PAGE_SIZE,
  })

  // General Settings data
  // const {
  //   generalSettings,
  //   companyInfo,
  //   systemPreferences,
  //   totalCount = 0,
  //   isLoading,
  //   error,
  // } = useGetGeneralSettingsData(pagination)

  // const { setOpen, setCurrentSettings, setCurrentCompanyInfo } = useGeneralSettingsStore()

  // if (error) {
  //   const errorResponse = (error as EnhancedError)?.response?.data
  //   return (
  //     <ErrorPage
  //       errorCode={errorResponse?.statusCode}
  //       message={errorResponse?.message}
  //     />
  //   )
  // }

  const handleEditGeneralSettings = () => {
      // setCurrentSettings(generalSettings)
      // setOpen('edit-settings')
  }

  const handleEditCompanyInfo = () => {
    // setCurrentCompanyInfo(companyInfo)
    // setOpen('edit-company')
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
        <div className="mb-8">
          <GeneralSettings />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleEditGeneralSettings}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            // disabled={isLoading}
          >
            Edit General Settings
          </button>
          <button
            onClick={handleEditCompanyInfo}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90"
            // disabled={isLoading}
          >
            Edit Company Information
          </button>
        </div>
      </div>

      <GeneralSettingsActionModal key={'general-settings-action-modal'} />
    </Main>
  )
}

export default GeneralSettingsPage
