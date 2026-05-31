
const Pagination = ({ page, totalPages, totalRecords, blogsLength, setPage }) => {
    // If there are no records, don't show pagination
    if (totalRecords === 0) return null;

    return (
        <div className="p-3 bg-white d-flex justify-content-between align-items-center border-top flex-wrap">
            <span className="small text-muted fw-medium">
                Showing <b>{blogsLength}</b> of <b>{totalRecords}</b> records
            </span>
            
            <div className="pagination-wrapper d-flex gap-2 align-items-center">
                <button 
                    className="pagination-btn" 
                    disabled={page === 1} 
                    onClick={() => setPage(page - 1)}
                >
                    Prev
                </button>

                {[...Array(totalPages)].map((_, i) => (
                    <button 
                        key={i} 
                        className={`page-number ${page === i + 1 ? 'active' : ''}`}
                        onClick={() => setPage(i + 1)}
                    >
                        {i + 1}
                    </button>
                ))}

                <button 
                    className="pagination-btn" 
                    disabled={page === totalPages} 
                    onClick={() => setPage(page + 1)}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Pagination;