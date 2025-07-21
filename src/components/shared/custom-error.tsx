// components/ui/ErrorPage.tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Link } from '@tanstack/react-router';
import { AlertCircle, Home } from 'lucide-react';


interface ErrorPageProps {
    errorCode?: number | string; // e.g., 404, 500, or custom code
    message?: string; // Custom error message
    className?: string; // Optional additional classes
}

export function ErrorPage({
    errorCode = '404',
    message = 'Oops! Something went wrong.',
    className,
}: ErrorPageProps) {
    return (
        <div className={cn('flex min-h-[70dvh] items-center justify-center bg-background p-4', className)}>
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                        <AlertCircle className="h-8 w-8 text-destructive" />
                    </div>
                    <CardTitle className="text-3xl font-bold">{errorCode}</CardTitle>
                    <CardDescription className="text-lg text-muted-foreground">
                        {message}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="mb-6 text-sm text-muted-foreground">
                        We’re sorry for the inconvenience. Let’s get you back on track.
                    </p>
                    <Button asChild variant="default" size="lg">
                        <Link to="/">
                            <Home className="mr-2 h-4 w-4" />
                            Back to Home
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}