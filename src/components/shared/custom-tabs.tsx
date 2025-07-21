import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils'; // Assuming you have this utility from ShadCN
import { LucideIcon } from 'lucide-react';
import { useCallback, useState } from 'react';

export type TabItem = {
  label: string;
  value: string;
  content: React.ReactNode;
  icon?: LucideIcon;
  disabled?: boolean;
  className?: string;
  contentClassName?: string;
};

type ConfigurableTabsProps = {
  tabs: TabItem[];
  defaultValue?: string;
  className?: string;
  tabsListClassName?: string;
  triggerClassName?: string;
  contentClassName?: string;
  orientation?: 'horizontal' | 'vertical';
  onTabChange?: (value: string) => void;
  renderTabTrigger?: (tab: TabItem, isActive: boolean) => React.ReactNode;
  renderTabContent?: (tab: TabItem) => React.ReactNode;
};

const ConfigurableTabs: React.FC<ConfigurableTabsProps> = ({
  tabs,
  defaultValue,
  className,
  tabsListClassName,
  triggerClassName,
  contentClassName,
  orientation = 'horizontal',
  onTabChange,
  renderTabTrigger,
  renderTabContent,
}) => {
  const [activeTab, setActiveTab] = useState(defaultValue || tabs[0]?.value);

  const handleTabChange = useCallback(
    (value: string) => {
      setActiveTab(value);
      onTabChange?.(value);
    },
    [onTabChange]
  );

  return (
    <Tabs
      value={activeTab}
      onValueChange={handleTabChange}
      defaultValue={defaultValue || tabs[0]?.value}
      className={cn('w-full', className)}
      orientation={orientation}
    >
      <TabsList
        className={cn(
          '',
          orientation === 'horizontal'
            ? 'flex-row border-b'
            : 'flex-col border-r',
          tabsListClassName
        )}
        aria-label="Custom tabs"
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.value;
          return (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              disabled={tab.disabled}
              className={cn(
                'flex items-center gap-2',
                orientation === 'horizontal' ? 'px-4 ' : 'px-2 py-3',
                isActive && 'bg-accent text-accent-foreground',
                tab.disabled && 'opacity-50 cursor-not-allowed',
                triggerClassName,
                tab.className
              )}
              aria-label={`${tab.label} tab`}
            >
              {renderTabTrigger ? (
                renderTabTrigger(tab, isActive)
              ) : (
                <>
                  {tab.icon && (
                    <tab.icon
                      className={cn('h-4 w-4', isActive && 'text-accent-foreground')}
                    />
                  )}
                  <span>{tab.label}</span>
                </>
              )}
            </TabsTrigger>
          );
        })}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent
          key={tab.value}
          value={tab.value}
          className={cn('mt-4', contentClassName, tab.contentClassName)}
        >
          {renderTabContent ? renderTabContent(tab) : tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default ConfigurableTabs;
