import ContentSection from '../components/content-section'
import { AccountForm } from './account-form'

export default function SettingsAccount() {
  return (
    <ContentSection
      title='Reset Password'
      desc='Update your account settings. Set your preferred language and
          timezone.'
    >
      <AccountForm />
    </ContentSection>
  )
}
