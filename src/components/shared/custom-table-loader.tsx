// components/table/TableLoader.tsx
import { Loader2 } from 'lucide-react';

export function TableLoader({ columnsLength }: { columnsLength: number }) {
    return (
        <div className="relative w-full overflow-hidden rounded-md border bg-background">
            {/* Spinning Loader Overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-background/50">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
            {/* Skeleton Loader for Table Rows */}
            <div className="divide-y border-b">
                {[...Array(5)].map((_, rowIndex) => (
                    <div
                        key={rowIndex}
                        className="flex w-full divide-x"
                    >
                        {[...Array(columnsLength)].map((__, colIndex) => (
                            <div
                                key={colIndex}
                                className="w-full p-4"
                            >
                                <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}