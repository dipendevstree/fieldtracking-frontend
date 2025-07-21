import { useState } from 'react'
import { Plus, Eye, Edit } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'

const salesReps = [
  {
    id: '1',
    name: 'John Smith',
    avatar: '/placeholder.svg?height=32&width=32',
  },
  // ... other reps
]

const customers = [
  { id: '1', name: 'Acme Corp', contact: 'Jane Doe' },
  // ... other customers
]

const recentTasks = [
  {
    id: '1',
    title: 'Prepare demo materials for Acme Corp',
    assignee: 'John Smith',
    dueDate: '2024-01-14',
    priority: 'high',
    status: 'in-progress',
    customer: 'Acme Corp',
  },
  // ... other tasks
]

export default function TaskAssignment() {
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false)

  const getStatusBadge = (status: string) => {
    const variants = {
      confirmed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800',
      'in-progress': 'bg-purple-100 text-purple-800',
    }
    return (
      variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800'
    )
  }

  const getPriorityBadge = (priority: string) => {
    const variants = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800',
    }
    return (
      variants[priority as keyof typeof variants] || 'bg-gray-100 text-gray-800'
    )
  }

  return (
    <>
      <div className='flex items-center justify-between'>
        <h3 className='text-lg font-semibold'>Task Assignment</h3>
        <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className='mr-2 h-4 w-4' /> Assign Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assign New Task</DialogTitle>
              <DialogDescription>
                Create and assign a task to a sales representative.
              </DialogDescription>
            </DialogHeader>
            <div className='grid gap-4 py-4'>
              <div className='space-y-2'>
                <Label htmlFor='task-title'>Task Title</Label>
                <Input placeholder='Enter task title' />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='assignee'>Assign to</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder='Select sales rep' />
                  </SelectTrigger>
                  <SelectContent>
                    {salesReps.map((rep) => (
                      <SelectItem key={rep.id} value={rep.id}>
                        {rep.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='due-date'>Due Date</Label>
                  <Input type='date' />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='task-priority'>Priority</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder='Select priority' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='high'>High</SelectItem>
                      <SelectItem value='medium'>Medium</SelectItem>
                      <SelectItem value='low'>Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='customer-link'>
                  Related Customer (Optional)
                </Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder='Link to customer' />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='task-description'>Description</Label>
                <Textarea placeholder='Provide task details and instructions...' />
              </div>
            </div>
            <div className='flex justify-end space-x-2'>
              <Button
                variant='outline'
                onClick={() => setIsTaskDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={() => setIsTaskDialogOpen(false)}>
                Assign Task
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Task Assignments</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                <TableHead>Assignee</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentTasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell className='font-medium'>{task.title}</TableCell>
                  <TableCell>
                    <div className='flex items-center space-x-2'>
                      <Avatar className='h-8 w-8'>
                        <AvatarImage src='/placeholder.svg' />
                        <AvatarFallback>
                          {task.assignee
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span>{task.assignee}</span>
                    </div>
                  </TableCell>
                  <TableCell>{task.dueDate}</TableCell>
                  <TableCell>
                    <Badge className={getPriorityBadge(task.priority)}>
                      {task.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>{task.customer}</TableCell>
                  <TableCell>
                    <Badge className={getStatusBadge(task.status)}>
                      {task.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className='flex space-x-2'>
                      <Button variant='outline' size='sm'>
                        <Eye className='h-4 w-4' />
                      </Button>
                      <Button variant='outline' size='sm'>
                        <Edit className='h-4 w-4' />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  )
}
