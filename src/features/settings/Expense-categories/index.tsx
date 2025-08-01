import { useState } from 'react'
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '@/data/app.data'
import { cn } from '@/lib/utils'
import { Main } from '@/components/layout/main'
import TablePageLayout from '@/components/layout/table-page-layout'
import { EnhancedError } from '@/types'
import ExpenseCategoryTable from './components/table'
// import { useGetExpenseCategoriesData } from './services/expense-categories.hook'
// import { useExpenseCategoriesStore } from './store/expense-categories.store'
import { ErrorPage } from '@/components/shared/custom-error'
import ExpenseCategories from './components/ExpenseCategories'

const ExpenseCategoriesPage = () => {
  const [pagination, setPagination] = useState({
    page: DEFAULT_PAGE_NUMBER,
    limit: DEFAULT_PAGE_SIZE,
  })

  // Expense Categories data
  // const {
  //   expenseCategories = [],
  //   perDiemSettings,
  //   categorySettings,
  //   totalCount = 0,
  //   isLoading,
  //   error,
  // } = useGetExpenseCategoriesData(pagination)

  // const { setOpen } = useExpenseCategoriesStore()

  // if (error) {
  //   const errorResponse = (error as EnhancedError)?.response?.data
  //   return (
  //     <ErrorPage
  //       errorCode={errorResponse?.statusCode}
  //       message={errorResponse?.message}
  //     />
  //   )
  // }

  const handleAddExpenseCategory = () => {
    // setOpen('add-category')
  }

  const onPaginationChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({ ...prev, page, limit: pageSize }))
  }

  return (
    <Main className={cn('flex flex-col gap-2 p-4')}>
      
      {/* Expense Categories Management Section */}
      <div className='mt-6'>
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Expense Categories Configuration</h2>
          <p className="text-muted-foreground ">
            Manage expense categories, their types, and default settings
          </p>
        </div>
          {/* Settings Configuration */}
          <div className="mb-8">
            <ExpenseCategories />
          </div>

          {/* Data Tables */}
          {/* <ExpenseCategoryTable
            // data={expenseCategories}
            // totalCount={totalCount}
            // loading={isLoading}
            currentPage={pagination.page}
            paginationCallbacks={{ onPaginationChange }}
          /> */}
        
      </div>
    </Main>
  )
}

export default ExpenseCategoriesPage
