interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: Props) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-1 mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg 
        disabled:opacity-40 disabled:cursor-not-allowedhover:bg-gray-50 transition bg-white cursor-pointer">
        Prev
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-9 h-9 text-sm rounded-lg font-medium transition ${
            page === currentPage
              ? 'bg-indigo-600 text-white border border-indigo-600'
              : 'border border-gray-300 text-white hover:bg-gray-50'
          }`}>
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg 
        disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition bg-white cursor-pointer">
        Next
      </button>
    </div>
  );
}
