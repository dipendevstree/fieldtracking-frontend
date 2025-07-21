
import { Main } from '@/components/layout/main';
import CommonPageHeader from '@/components/shared/common-page-header';

import CustomTabs, { TabItem } from '@/components/shared/custom-tabs';
import BusinessSection from './components/business-section';
import GeneralInfoSection from './components/general-info';
import HeaderCardInfo from './components/header-card';
import SettingsSection from './components/settings-section';
import VerificationSection from './components/verification-section';
import WorkingHoursSection from './components/working-hours-section';

const MerchantDetailsPage = ({ data }: { data: any }) => {
  const merchantData = data ?? {}

  const tabs: TabItem[] = [
    { label: 'General Info', value: 'general', content: <GeneralInfoSection merchantData={merchantData} /> },
    { label: 'Working Hours', value: 'working-hours', content: <WorkingHoursSection data={merchantData?.working_hours} /> },
    { label: 'Business Details', value: 'business', content: <BusinessSection data={merchantData} /> },
    { label: 'Verification', value: 'verification', content: <VerificationSection merchantData={merchantData} /> },
    { label: 'Settings', value: 'settings', content: <SettingsSection merchantData={merchantData} /> },
  ]
  return (
    <Main className="space-y-6">
      <CommonPageHeader moduleName='Seller Details' />
      <HeaderCardInfo merchantData={merchantData} />

      <CustomTabs
        tabs={tabs}
        defaultValue='general'
        tabsListClassName='grid w-full grid-cols-5'
      />
    </Main>
  );
};

export default MerchantDetailsPage;
