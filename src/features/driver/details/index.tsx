import { Main } from '@/components/layout/main';
import CommonPageHeader from '@/components/shared/common-page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Car,
    FileText
} from 'lucide-react';
import { AccountDetails } from './components/driver-account-details';
import { DocumentCard } from './components/driver-document-card';
import { DriverHeader } from './components/driver-header';
import { PersonalInfo } from './components/driver-personal-info';
import { VehicleCard } from './components/driver-vehicle-card';
import { VerificationStatus } from './components/driver-verification-status';
import { DriverData } from './types';

interface DriverDetailsPageProps {
    driverData: DriverData;
}

const DriverDetailsPage: React.FC<DriverDetailsPageProps> = ({ driverData }) => {
    return (
        <Main>
            <CommonPageHeader moduleName="Driver Details" className='mb-4' />
            <div className="space-y-6">
                <DriverHeader driverData={driverData} />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <PersonalInfo driverData={driverData} />
                    <VerificationStatus driverData={driverData} />
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <FileText className="w-5 h-5" />
                            <span>Documents</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {driverData?.documents?.map((doc, index) => (
                            <DocumentCard key={index} document={doc} />
                        ))}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Car className="w-5 h-5" />
                            <span>Registered Vehicles</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {driverData?.vehicles?.map((vehicle, index) => (
                            <VehicleCard key={index} vehicle={vehicle} />
                        ))}
                    </CardContent>
                </Card>
                <AccountDetails driverData={driverData} />
            </div>
        </Main>
    );
};

export default DriverDetailsPage;
