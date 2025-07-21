import { useParams } from '@tanstack/react-router'
import sampleReceipt from '@/assets/a320e87c6acd18eb34ccbfefbcddc062644af66a.png'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Main } from '@/components/layout/main'

const mockExpenseDataMap: Record<string, any> = {
  '1': {
    user: {
      name: 'John Smith',
      avatarUrl: '',
      submittedAt: '2024-01-15 14:30',
    },
    date: '2024-01-15',
    category: 'Travel Allowance',
    amount: 45.5,
    mileage: 25,
    description: 'Client visit - Downtown office meeting with ABC Corporation',
    purpose: 'Quarterly business review meeting',
    startLocation: 'Office - 123 Main St',
    endLocation: 'ABC Corp - 456 Business Ave',
    notes:
      'Client requested in-person meeting for Q4 review. Discussed new product features and pricing.',
    receiptImageUrl: sampleReceipt,
  },
  '2': {
    user: {
      name: 'Alice Johnson',
      avatarUrl: '',
      submittedAt: '2024-02-10 09:15',
    },
    date: '2024-02-10',
    category: 'Food',
    amount: 25,
    mileage: 0,
    description: 'Team lunch with new project team',
    purpose: 'Welcome lunch for new team members',
    startLocation: 'Company HQ',
    endLocation: 'Nearby Restaurant',
    notes: 'Introduced project roadmap to new team.',
    receiptImageUrl: 'https://via.placeholder.com/150',
  },
}

export default function DailyExpenseDetails() {
  const params = useParams({ strict: false })
  const id = params.id

  const expenseData = mockExpenseDataMap[id || ''] ?? {
    user: { name: 'Unknown', avatarUrl: '', submittedAt: '-' },
    date: '-',
    category: '-',
    amount: 0,
    mileage: 0,
    description: '-',
    purpose: '-',
    startLocation: '-',
    endLocation: '-',
    notes: '-',
    receiptImageUrl: sampleReceipt,
  }

  return (
    <Main>
      <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
        {/* Expense Information */}
        <Card>
          <CardHeader>
            <CardTitle>Expense Information</CardTitle>
            <CardDescription>
              Detailed breakdown of the expense submission
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex items-center space-x-4'>
              <Avatar>
                <AvatarImage src={expenseData.user.avatarUrl} />
                <AvatarFallback>
                  {expenseData.user.name
                    .split(' ')
                    .map((n: any) => n[0])
                    .join('')
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className='font-medium'>{expenseData.user.name}</p>
                <p className='text-muted-foreground text-sm'>
                  Submitted on {expenseData.user.submittedAt}
                </p>
              </div>
            </div>

            <div className='grid grid-cols-4 gap-2 text-sm'>
              <div>
                <p className='font-medium'>Date</p>
                <p>{expenseData.date}</p>
              </div>
              <div>
                <p className='font-medium'>Category</p>
                <p>{expenseData.category}</p>
              </div>
              <div>
                <p className='font-medium'>Amount</p>
                <p>${expenseData.amount.toFixed(2)}</p>
              </div>
              <div>
                <p className='font-medium'>Mileage</p>
                <p>{expenseData.mileage} miles</p>
              </div>
            </div>

            <div>
              <p className='font-medium'>Description</p>
              <p>{expenseData.description}</p>
            </div>
            <div>
              <p className='font-medium'>Purpose</p>
              <p>{expenseData.purpose}</p>
            </div>
            <div>
              <p className='font-medium'>Start Location</p>
              <p>{expenseData.startLocation}</p>
            </div>
            <div>
              <p className='font-medium'>End Location</p>
              <p>{expenseData.endLocation}</p>
            </div>
            <div>
              <p className='font-medium'>Additional Notes</p>
              <p>{expenseData.notes}</p>
            </div>

            <div>
              <Button variant='outline' className='bg-muted w-full'>
                Export Daily Expenses (PDF)
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Receipt & Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Receipt & Actions</CardTitle>
            <CardDescription>
              Review attached receipt and take action
            </CardDescription>
          </CardHeader>
          <CardContent className='flex flex-col items-center space-y-4'>
            <img
              src={expenseData.receiptImageUrl}
              alt='Receipt'
              className='h-auto w-40 rounded border'
            />

            <Dialog>
              <DialogTrigger asChild>
                <Button variant='outline'>View Full Size</Button>
              </DialogTrigger>
              <DialogContent className='max-w-4xl p-0'>
                <img
                  src={expenseData.receiptImageUrl}
                  alt='Full Receipt'
                  className='h-auto w-full rounded'
                />
              </DialogContent>
            </Dialog>

            <Textarea placeholder='Add Comment (Optional)' />

            <div className='grid w-full grid-cols-2 gap-2'>
              <Button className='bg-green-600 text-white hover:bg-green-700'>
                Approve Expense
              </Button>
              <Button variant='destructive'>Reject Expense</Button>
            </div>
            <div className='grid w-full grid-cols-2 gap-2'>
              <Button variant='outline'>Forward to Next Level</Button>
              <Button variant='outline'>Request More Information</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Main>
  )
}
