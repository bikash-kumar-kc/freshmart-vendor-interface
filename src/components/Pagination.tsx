// components/Pagination.tsx
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
}

const DOTS = "DOTS";

function getPaginationRange(
  page: number,
  totalPages: number,
  siblingCount: number,
) {
  const totalPageNumbers = siblingCount * 2 + 5; // first + last + current + 2 dots + siblings

  if (totalPageNumbers >= totalPages) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const leftSiblingIndex = Math.max(page - siblingCount, 1);
  const rightSiblingIndex = Math.min(page + siblingCount, totalPages);

  const showLeftDots = leftSiblingIndex > 2;
  const showRightDots = rightSiblingIndex < totalPages - 1;

  const firstPageIndex = 1;
  const lastPageIndex = totalPages;

  if (!showLeftDots && showRightDots) {
    const leftItemCount = 3 + 2 * siblingCount;
    const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
    return [...leftRange, DOTS, totalPages];
  }

  if (showLeftDots && !showRightDots) {
    const rightItemCount = 3 + 2 * siblingCount;
    const rightRange = Array.from(
      { length: rightItemCount },
      (_, i) => totalPages - rightItemCount + i + 1,
    );
    return [firstPageIndex, DOTS, ...rightRange];
  }

  const middleRange = Array.from(
    { length: rightSiblingIndex - leftSiblingIndex + 1 },
    (_, i) => leftSiblingIndex + i,
  );
  return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
}

export default function Pagination({
  page,
  totalPages,
  onPageChange,
  siblingCount = 1,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const range = getPaginationRange(page, totalPages, siblingCount);

  return (
    <nav className="flex items-center gap-1">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="flex items-center justify-center w-8 h-8 rounded-sm border border-gray-200 text-gray-500 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-green-700 hover:text-white transition-colors"
        aria-label="Previous page"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {range.map((item, i) =>
        item === DOTS ? (
          <span
            key={`dots-${i}`}
            className="flex items-center justify-center w-8 h-8 text-gray-400"
          >
            <MoreHorizontal className="w-4 h-4" />
          </span>
        ) : (
          <button
            key={item}
            onClick={() => onPageChange(item as number)}
            aria-current={page === item ? "page" : undefined}
            className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors ${
              page === item
                ? "bg-green-500 hover:bg-green-700 text-white"
                : "text-gray-600 border border-gray-200 hover:bg-gray-50 hover:border-green-300"
            }`}
          >
            {item}
          </button>
        ),
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="flex items-center justify-center w-8 h-8 rounded-sm border border-gray-200 text-gray-500 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-green-700 hover:text-white transition-colors"
        aria-label="Next page"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </nav>
  );
}
