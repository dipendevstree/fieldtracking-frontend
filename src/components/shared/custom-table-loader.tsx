// components/shared/custom-table-loader.tsx
import { TableCell, TableRow } from "@/components/ui/table";

export function TableLoader({ columnsLength }: { columnsLength: number }) {
  return (
    <>
      {[...Array(5)].map((_, rowIndex) => (
        <TableRow key={rowIndex} className="hover:bg-transparent">
          {[...Array(columnsLength)].map((__, colIndex) => (
            <TableCell key={colIndex} className="p-4">
              <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}
