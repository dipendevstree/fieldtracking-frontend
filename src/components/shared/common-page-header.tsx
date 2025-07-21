import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { IconArrowLeft } from '@tabler/icons-react';
import { useRouter } from '@tanstack/react-router';
import { FC } from 'react';

interface CommonPageHeaderProps {
  moduleName: string;
  className?: string;
}

const CommonPageHeader: FC<CommonPageHeaderProps> = ({ moduleName, className }) => {
  const { history: { back } } = useRouter();

  return (
    <header className={`sticky top-0 z-10 bg-background border-b rounded-xl border-border shadow-sm ${className}`}>
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left Section: Back Button and Module Name */}
        <div className="flex items-center gap-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => back()}
                  className="hover:bg-accent rounded-full cursor-pointer"
                  aria-label="Go back"
                >
                  <IconArrowLeft className="h-5 w-5 text-foreground" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Go Back</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <h1 className="text-xl font-semibold text-foreground">{moduleName}</h1>
        </div>
      </div>
    </header>
  );
};

export default CommonPageHeader;
