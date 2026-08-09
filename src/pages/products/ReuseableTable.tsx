import MotionStagger from "@/components/motion/MotionStagger";
import type { ReactNode } from "react";

export interface IColumn {
  id: string;
  label: string;
  align?: "left" | "right" | "center";
  width?: string;
}

interface ReusableTableProps<T> {
  columns: IColumn[];
  data: T[];
  renderRow: (item: T) => ReactNode;
  loading?: boolean;
  emptyMessage?: string;
  rowKey: (item: T) => string | number;
}

const alignClass = (align?: IColumn["align"]) =>
  align === "right"
    ? "text-right"
    : align === "center"
      ? "text-center"
      : "text-left";

export default function ReusableTable<T>({
  columns,
  data,
  renderRow,
  loading = false,
  emptyMessage = "No records found.",
  rowKey,
}: ReusableTableProps<T>) {
  return (
    <>
      <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                {columns.map((col) => (
                  <th
                    key={col.id}
                    style={{ width: col.width }}
                    className={`px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide ${alignClass(col.align)}`}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-4 py-8 text-center text-gray-400"
                  >
                    Loading...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-4 py-8 text-center text-gray-400"
                  >
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                data.map((item, idx) => (
                  <MotionStagger idx={idx} isWindowView={false}>
                    {renderRow(item)}
                  </MotionStagger>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
