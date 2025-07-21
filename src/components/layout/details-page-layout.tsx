import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Award,
    Calendar,
    CheckCircle2,
    Clock,
    Copy,
    CreditCard,
    Edit3,
    ExternalLink,
    FileText,
    Languages,
    Mail,
    MapPin,
    MoreVertical,
    Percent,
    Phone,
    // TrendingUp,
    Shield,
    Star,
    User,
    UserCheck,
    Users
} from 'lucide-react';
import React, { useState } from 'react';
import { Main } from './main';

interface ServiceProvider {
    name: string;
    status: boolean;
    email: string;
    emailVerified: boolean;
    mobile: string;
    mobileVerified: boolean;
    language: string;
    skill: string;
    gender: string;
    address: string;
    discount: number;
    referralCode: string;
    referredBy: string | null;
    about: string | null;
    totalServices: number;
    totalBookings: number;
    kycStatus: boolean;
    bankDetails: {
        accountHolderName: string | null;
        accountNumber: string | null;
    };
}

// Mock data for demonstration
const mockProvider: ServiceProvider = {
    name: "Sarah Johnson",
    status: true,
    email: "sarah.johnson@example.com",
    emailVerified: true,
    mobile: "+1 (555) 123-4567",
    mobileVerified: true,
    language: "English, Spanish",
    skill: "Hair Styling & Makeup",
    gender: "Female",
    address: "123 Beauty Lane, New York, NY 10001",
    discount: 15,
    referralCode: "SARAH2024",
    referredBy: "Maria Garcia",
    about: "Professional hair stylist with 8+ years of experience in bridal and event styling. Specialized in modern cuts and color techniques.",
    totalServices: 156,
    totalBookings: 89,
    kycStatus: true,
    bankDetails: {
        accountHolderName: "Sarah Johnson",
        accountNumber: "****1234"
    }
};

const ServiceProviderDetails: React.FC = () => {
    const [provider] = useState<ServiceProvider>(mockProvider);
    const [activeTab, setActiveTab] = useState("general");
    const [providerStatus, setProviderStatus] = useState(provider.status);

    const handleStatusChange = (status: boolean) => {
        setProviderStatus(status);
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    return (
        // <div className=" bg-gradient-to-br  from-gray-100 to-gray-100">
        <Main>
            <div className=" space-y-6">
                {/* Enhanced Header */}
                <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30">
                                    <User className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold mb-1">{provider.name}</h1>
                                    <div className="flex items-center space-x-2">
                                        <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                                            {provider.skill}
                                        </Badge>
                                        <Badge variant="secondary" className="bg-green-500/20 text-white border-green-400/30">
                                            <Award className="w-3 h-3 mr-1" />
                                            Verified Provider
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="text-right">
                                    <Label htmlFor="status-switch" className="text-white/90 text-sm">
                                        Provider Status
                                    </Label>
                                    <div className="flex items-center space-x-2 mt-1">
                                        <span className="text-sm text-white/80">
                                            {providerStatus ? 'Active' : 'Inactive'}
                                        </span>
                                        <Switch
                                            id="status-switch"
                                            checked={providerStatus}
                                            onCheckedChange={handleStatusChange}
                                            className="data-[state=checked]:bg-green-500"
                                        />
                                    </div>
                                </div>
                                <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                                    <Edit3 className="w-4 h-4 mr-2" />
                                    Edit
                                </Button>
                                <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                                    <MoreVertical className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
                        <CardContent className="p-4 text-center">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <FileText className="w-6 h-6 text-blue-600" />
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{provider.totalServices}</p>
                            <p className="text-sm text-gray-500">Total Services</p>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
                        <CardContent className="p-4 text-center">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Calendar className="w-6 h-6 text-green-600" />
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{provider.totalBookings}</p>
                            <p className="text-sm text-gray-500">Total Bookings</p>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
                        <CardContent className="p-4 text-center">
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Percent className="w-6 h-6 text-purple-600" />
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{provider.discount}%</p>
                            <p className="text-sm text-gray-500">Discount Rate</p>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
                        <CardContent className="p-4 text-center">
                            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Star className="w-6 h-6 text-orange-600" />
                            </div>
                            <p className="text-2xl font-bold text-gray-900">4.8</p>
                            <p className="text-sm text-gray-500">Average Rating</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Enhanced Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <Card className="border-0 shadow-md py-0">
                        <TabsList className="w-fit gap-3 justify-start py-2 px-3 h-auto">
                            <TabsTrigger
                                value="general"
                            // className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-6 py-3 font-medium"
                            >
                                <FileText className="w-4 h-4 mr-2" />
                                General Details
                            </TabsTrigger>
                            <TabsTrigger
                                value="slot"
                            // className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-6 py-3 font-medium"
                            >
                                <Clock className="w-4 h-4 mr-2" />
                                Availability
                            </TabsTrigger>
                            <TabsTrigger
                                value="booking"
                            // className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-6 py-3 font-medium"
                            >
                                <Calendar className="w-4 h-4 mr-2" />
                                Bookings
                            </TabsTrigger>
                            <TabsTrigger
                                value="rating"
                            // className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-6 py-3 font-medium"
                            >
                                <Star className="w-4 h-4 mr-2" />
                                Reviews
                            </TabsTrigger>
                        </TabsList>

                        <Separator className="my-2" />

                        <TabsContent value="general" className="p-6 space-y-6">
                            {/* Personal Information */}
                            <Card className="border border-gray-200">
                                <CardHeader className="pb-3">
                                    <CardTitle className="flex items-center text-lg">
                                        <User className="w-5 h-5 mr-2 text-blue-600" />
                                        Personal Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <DetailItem
                                            icon={<Mail className="w-5 h-5 text-gray-400" />}
                                            label="Email Address"
                                            value={provider.email}
                                            badge={
                                                provider.emailVerified ? (
                                                    <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
                                                        <CheckCircle2 className="w-3 h-3 mr-1" />
                                                        Verified
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="destructive">Not Verified</Badge>
                                                )
                                            }
                                            actionButton={
                                                <Button variant="ghost" size="sm" onClick={() => copyToClipboard(provider.email)}>
                                                    <Copy className="w-4 h-4" />
                                                </Button>
                                            }
                                        />
                                        <DetailItem
                                            icon={<Phone className="w-5 h-5 text-gray-400" />}
                                            label="Mobile Number"
                                            value={provider.mobile}
                                            badge={
                                                provider.mobileVerified ? (
                                                    <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
                                                        <CheckCircle2 className="w-3 h-3 mr-1" />
                                                        Verified
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="destructive">Not Verified</Badge>
                                                )
                                            }
                                            actionButton={
                                                <Button variant="ghost" size="sm" onClick={() => copyToClipboard(provider.mobile)}>
                                                    <Copy className="w-4 h-4" />
                                                </Button>
                                            }
                                        />
                                        <DetailItem
                                            icon={<UserCheck className="w-5 h-5 text-gray-400" />}
                                            label="Gender"
                                            value={provider.gender}
                                        />
                                        <DetailItem
                                            icon={<Languages className="w-5 h-5 text-gray-400" />}
                                            label="Languages"
                                            value={provider.language}
                                        />
                                        <DetailItem
                                            icon={<MapPin className="w-5 h-5 text-gray-400" />}
                                            label="Address"
                                            value={provider.address}
                                            actionButton={
                                                <Button variant="ghost" size="sm">
                                                    <ExternalLink className="w-4 h-4" />
                                                </Button>
                                            }
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Professional Information */}
                            <Card className="border border-gray-200">
                                <CardHeader className="pb-3">
                                    <CardTitle className="flex items-center text-lg">
                                        <Award className="w-5 h-5 mr-2 text-purple-600" />
                                        Professional Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <DetailItem
                                            icon={<FileText className="w-5 h-5 text-gray-400" />}
                                            label="Primary Skill"
                                            value={provider.skill}
                                            badge={<Badge variant="secondary">Featured</Badge>}
                                        />
                                        <DetailItem
                                            icon={<Percent className="w-5 h-5 text-gray-400" />}
                                            label="Discount Percentage"
                                            value={`${provider.discount}%`}
                                            badge={<Badge variant="outline" className="text-orange-600 border-orange-200">{provider.discount}%</Badge>}
                                        />
                                        <DetailItem
                                            icon={<Users className="w-5 h-5 text-gray-400" />}
                                            label="Referral Code"
                                            value={provider.referralCode}
                                            actionButton={
                                                <Button variant="ghost" size="sm" onClick={() => copyToClipboard(provider.referralCode)}>
                                                    <Copy className="w-4 h-4" />
                                                </Button>
                                            }
                                        />
                                        <DetailItem
                                            icon={<Users className="w-5 h-5 text-gray-400" />}
                                            label="Referred By"
                                            value={provider.referredBy || 'Direct Registration'}
                                        />
                                        <DetailItem
                                            icon={<Shield className="w-5 h-5 text-gray-400" />}
                                            label="KYC Status"
                                            value={provider.kycStatus ? 'Completed' : 'Pending'}
                                            badge={
                                                provider.kycStatus ? (
                                                    <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
                                                        <CheckCircle2 className="w-3 h-3 mr-1" />
                                                        Verified
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="destructive">Pending</Badge>
                                                )
                                            }
                                        />
                                    </div>

                                    {provider.about && (
                                        <div className="mt-6 pt-6 border-t">
                                            <div className="space-y-2">
                                                <Label className="text-sm font-medium text-gray-700">About</Label>
                                                <p className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-lg">
                                                    {provider.about}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Bank Details */}
                            <Card className="border border-gray-200">
                                <CardHeader className="pb-3">
                                    <CardTitle className="flex items-center text-lg">
                                        <CreditCard className="w-5 h-5 mr-2 text-green-600" />
                                        Bank Details
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <DetailItem
                                            icon={<User className="w-5 h-5 text-gray-400" />}
                                            label="Account Holder Name"
                                            value={provider.bankDetails.accountHolderName || 'Not Provided'}
                                        />
                                        <DetailItem
                                            icon={<CreditCard className="w-5 h-5 text-gray-400" />}
                                            label="Account Number"
                                            value={provider.bankDetails.accountNumber || 'Not Provided'}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="slot" className="p-6">
                            <div className="text-center py-12">
                                <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Availability Management</h3>
                                <p className="text-gray-500">Configure time slots and availability schedules</p>
                                <Button className="mt-4">
                                    Configure Slots
                                </Button>
                            </div>
                        </TabsContent>

                        <TabsContent value="booking" className="p-6">
                            <div className="text-center py-12">
                                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Booking Management</h3>
                                <p className="text-gray-500">View and manage all bookings and appointments</p>
                                <Button className="mt-4">
                                    View Bookings
                                </Button>
                            </div>
                        </TabsContent>

                        <TabsContent value="rating" className="p-6">
                            <div className="text-center py-12">
                                <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Reviews & Ratings</h3>
                                <p className="text-gray-500">Customer feedback and rating analytics</p>
                                <Button className="mt-4">
                                    View Reviews
                                </Button>
                            </div>
                        </TabsContent>
                    </Card>
                </Tabs>
            </div>
        </Main>
        // </div>
    );
};

// Enhanced Detail Item Component
interface DetailItemProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    badge?: React.ReactNode;
    actionButton?: React.ReactNode;
}

const DetailItem: React.FC<DetailItemProps> = ({ icon, label, value, badge, actionButton }) => (
    <div className="space-y-2">
        <div className="flex items-center space-x-2">
            {icon}
            <Label className="text-sm font-medium text-gray-700">{label}</Label>
        </div>
        <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 flex-1">
                <p className="text-gray-900 font-medium">{value}</p>
                {badge}
            </div>
            {actionButton}
        </div>
    </div>
);

export default ServiceProviderDetails;