
export interface Document {
    document_id: string;
    type: string;
    reference_country: string;
    first_name: string;
    last_name: string;
    id_number: string;
    insurance_date: string;
    documents: string[];
}

export interface Vehicle {
    vehicle_id: string;
    make: string;
    model: string;
    color: string;
    modelYear: number;
    plate_number: string;
    vehicle_documents: string[];
    vehicle_photos: string[];
}

export interface DriverData {
    user_id: string;
    name: string;
    is_online: boolean;
    email: string;
    country_code: string;
    mobile: string;
    country: string;
    profile_pic: string;
    wallet: number;
    login_type: string;
    gender: string;
    language: string;
    device_type: string;
    status: boolean;
    is_completed_profile: boolean;
    is_otp_verified: boolean;
    is_mobile_verified: boolean;
    is_email_verified: boolean;
    created_at: string;
    updated_at: string;
    documents: Document[];
    vehicles: Vehicle[];
}

// StatusIcon Component
export interface StatusIconProps {
    verified: boolean;
    size?: number;
}