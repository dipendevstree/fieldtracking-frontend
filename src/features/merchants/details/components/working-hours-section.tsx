import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useParams, useRouter } from '@tanstack/react-router';
import { Loader2, Save, Settings, XCircle } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { DAY_MAPPING, defaultWorkingDays, SHORT_NAME_MAPPING } from '../data/merchants.details.data';
import { useUpdateWorkingDays } from '../services/services';

// Types
export interface WorkingDay {
  id: string;
  day: number;
  dayName: string;
  shortName: string;
  start_time: string;
  end_time: string;
  is_closed: boolean;
  is_accepted_order: boolean;
}

export interface ApiWorkingDay {
  id: string;
  day: number;
  start_time: string;
  end_time: string;
  is_closed: boolean;
  is_accepted_order: boolean;
}

// Constants

interface WorkingHoursSectionProps {
  data: ApiWorkingDay[] | null;
}

const WorkingHoursSection = ({ data }: WorkingHoursSectionProps) => {
  const [scheduleData, setScheduleData] = useState<WorkingDay[]>(defaultWorkingDays);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const { id } = useParams({ from: '/_authenticated/merchants/details/$id' });
  const router = useRouter()
  const handleSuccessUpdateWorkingDays = async () => {
    await router.invalidate({
      filter: (route) => route.id === '/_authenticated/merchants/details/$id',
    })
  }
  const { mutate: updateWorkingDays, isPending: isLoading } = useUpdateWorkingDays({ id: id, onSuccess: handleSuccessUpdateWorkingDays });

  // Transform API data to component format
  const transformedData = useMemo(() => {
    if (!data || data.length === 0) return defaultWorkingDays;
    return data
      .map((item: ApiWorkingDay) => ({
        id: item.id,
        day: item.day,
        dayName: DAY_MAPPING[item.day] || `Day ${item.day}`,
        shortName: SHORT_NAME_MAPPING[item.day] || `D${item.day}`,
        start_time: item.start_time,
        end_time: item.end_time,
        is_closed: item.is_closed,
        is_accepted_order: item.is_accepted_order,
      }))
      .sort((a, b) => a.day - b.day);
  }, [data]);

  useEffect(() => {
    setScheduleData(transformedData);
    setHasUnsavedChanges(false);
  }, [transformedData]);

  const toggleDayStatus = useCallback((id: string) => {
    setScheduleData(prev =>
      prev.map(day =>
        day.id === id ? { ...day, is_closed: !day.is_closed } : day
      )
    );
    setHasUnsavedChanges(true);
  }, []);

  const updateTime = useCallback((id: string, field: 'start_time' | 'end_time', value: string) => {
    if (!/^([0-1]?\d|2[0-3]):[0-5]\d$/.test(value)) {
      // eslint-disable-next-line no-console
      console.warn('Invalid time format:', value);
      return;
    }

    setScheduleData(prev =>
      prev.map(day =>
        day.id === id ? { ...day, [field]: value } : day
      )
    );
    setHasUnsavedChanges(true);
  }, []);

  const handleSaveChanges = useCallback(() => {
    if (!hasUnsavedChanges) return;
    const payload = {
      working_hours: scheduleData.map(day => ({
        day: day.day,
        start_time: day.start_time,
        end_time: day.end_time,
        is_closed: day.is_closed,
        is_accepted_order: day.is_accepted_order,
      })),
    };
    updateWorkingDays(payload);
  }, [scheduleData, hasUnsavedChanges, updateWorkingDays]);



  let buttonText = 'No Changes';
  if (isLoading) {
    buttonText = 'Saving...';
  } else if (hasUnsavedChanges) {
    buttonText = 'Save Changes';
  }

  return (
    <div className="w-full">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Operating Schedule
              </CardTitle>
            </div>
            <Button
              variant={hasUnsavedChanges ? 'default' : 'outline'}
              size="sm"
              className="gap-2"
              onClick={handleSaveChanges}
              disabled={!hasUnsavedChanges || isLoading}
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {buttonText}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {scheduleData.map((day, index) => (
              <div key={day.id}>
                <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="text-center min-w-[60px]">
                      <div className="text-sm font-semibold">{day.shortName}</div>
                      <div className="text-xs text-muted-foreground">{day.dayName}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={!day.is_closed}
                        onCheckedChange={() => toggleDayStatus(day.id)}
                        id={`day-${day.id}`}
                      />
                      <Label htmlFor={`day-${day.id}`} className="text-sm font-medium">
                        {day.is_closed ? 'Closed' : 'Open'}
                      </Label>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {day.is_closed ? (
                      <div className="min-w-[100px] text-right">
                        <Badge variant="secondary" className="gap-1">
                          <XCircle className="h-3 w-3" />
                          Closed
                        </Badge>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-2">
                          <Label htmlFor={`start-${day.id}`} className="text-xs text-muted-foreground">
                            From
                          </Label>
                          <Input
                            id={`start-${day.id}`}
                            type="time"
                            value={day.start_time}
                            onChange={e => updateTime(day.id, 'start_time', e.target.value)}
                            className="w-[120px] h-8"
                            step="300"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Label htmlFor={`end-${day.id}`} className="text-xs text-muted-foreground">
                            To
                          </Label>
                          <Input
                            id={`end-${day.id}`}
                            type="time"
                            value={day.end_time}
                            onChange={e => updateTime(day.id, 'end_time', e.target.value)}
                            className="w-[120px] h-8"
                            step="300"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
                {index < scheduleData.length - 1 && <Separator className="my-2" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
export default WorkingHoursSection;
