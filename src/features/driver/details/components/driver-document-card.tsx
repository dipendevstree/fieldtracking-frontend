import { Badge } from "@/components/ui/badge";
import { Document } from "../types";
import { formatDate } from "../utils/formatDate";
import { FileText } from "lucide-react";

interface DocumentCardProps {
    document: Document;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({ document }) => (
    <div className="border rounded-lg p-4 space-y-4">
        <div className="flex items-center justify-between">
            <Badge variant="outline" className="capitalize">
                {document?.type}
            </Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
                <span className="font-medium text-gray-700">Name: </span>
                <span>{document?.first_name} {document?.last_name}</span>
            </div>
            <div>
                <span className="font-medium text-gray-700">ID Number: </span>
                <span>{document?.id_number}</span>
            </div>
            <div>
                <span className="font-medium text-gray-700">Country: </span>
                <span>{document?.reference_country}</span>
            </div>
        </div>
        <div className="text-sm">
            <span className="font-medium text-gray-700">Insurance Date: </span>
            <span>{formatDate(document?.insurance_date)}</span>
        </div>
        <div className="flex items-center space-x-2" onClick={() => window.open(document?.documents?.[0], '_blank')}>
            <FileText className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-blue-600 hover:underline cursor-pointer">
                View Document
            </span>
        </div>
    </div>
);