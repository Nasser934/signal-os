import { useState, useMemo } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Column<T> {
  key: string;
  header: string;
  width?: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  className?: string;
  rowClassName?: string;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
}

export default function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  className,
  rowClassName,
  onRowClick,
  emptyMessage = 'No data available',
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const sortedData = useMemo(() => {
    if (!sortKey) return data;

    return [...data].sort((a, b) => {
      const aVal = a[sortKey as keyof T];
      const bVal = b[sortKey as keyof T];

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }

      const aStr = String(aVal ?? '').toLowerCase();
      const bStr = String(bVal ?? '').toLowerCase();
      if (sortDirection === 'asc') return aStr.localeCompare(bStr);
      return bStr.localeCompare(aStr);
    });
  }, [data, sortKey, sortDirection]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDirection('desc');
    }
  };

  const SortIcon = ({ columnKey }: { columnKey: string }) => {
    if (sortKey !== columnKey) return <ArrowUpDown className="w-3 h-3 text-[#5A6480]" />;
    return sortDirection === 'asc'
      ? <ArrowUp className="w-3 h-3 text-[#4E8DFF]" />
      : <ArrowDown className="w-3 h-3 text-[#4E8DFF]" />;
  };

  if (data.length === 0) {
    return (
      <div className="glass-card p-8 text-center">
        <p className="text-[#5A6480] text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={cn('w-full overflow-x-auto', className)}>
      <table className="w-full">
        <thead>
          <tr className="border-b border-[rgba(255,255,255,0.08)]">
            {columns.map(col => (
              <th
                key={col.key}
                className={cn(
                  'py-3 px-4 text-left text-xs font-medium text-[#5A6480] uppercase tracking-wider',
                  col.sortable && 'cursor-pointer select-none hover:text-[#8B95B8]',
                  col.width
                )}
                style={col.width ? { width: col.width } : undefined}
                onClick={() => col.sortable && handleSort(col.key)}
              >
                <div className="flex items-center gap-1.5">
                  {col.header}
                  {col.sortable && <SortIcon columnKey={col.key} />}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, i) => (
            <tr
              key={i}
              className={cn(
                'border-b border-[rgba(255,255,255,0.04)] transition-colors',
                'hover:bg-[rgba(78,141,255,0.04)]',
                onRowClick && 'cursor-pointer',
                rowClassName
              )}
              onClick={() => onRowClick?.(row)}
            >
              {columns.map(col => (
                <td
                  key={col.key}
                  className="py-3 px-4 text-sm text-[#E0E4F0]"
                >
                  {col.render
                    ? col.render(row)
                    : String(row[col.key as keyof T] ?? '-')
                  }
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
