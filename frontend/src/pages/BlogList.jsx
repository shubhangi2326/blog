import { useState } from "react";
import { Link } from "react-router-dom";
import { useBlogs } from "../hooks/useBlogs";
import Pagination from "../components/Pagination";

const BlogList = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");

  const { blogs, loading, meta, deleteBlogById, exportCSV } = useBlogs(
    search,
    page,
    category,
    status,
  );

  const formatTitle = (t) =>
    t && t.split(" ").length > 4
      ? t.split(" ").slice(0, 4).join(" ") + "..."
      : t;
  const formatDate = (d) =>
    new Date(d).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div className="container py-3 py-md-4">
      {/* Soft Header: Responsive row */}
      <div className="ui-card p-3 p-md-4 mb-4 shadow-sm">
        <div className="row align-items-center g-3">
          <div className="col-12 col-md-6 text-center text-md-start">
            <h2 className="text-navy fw-bold m-0 h3">Blog Post Manager</h2>
            <p className="text-muted m-0 small">
              Effortless content organization
            </p>
          </div>
          <div className="col-12 col-md-6 d-flex justify-content-center justify-content-md-end gap-2">
            <button
              onClick={exportCSV}
              className="btn btn-outline-secondary px-3 fw-bold border-2 btn-sm btn-md-base"
              style={{ borderRadius: "8px" }}
            >
              Export CSV
            </button>
            <Link
              to="/add"
              className="btn-gold text-decoration-none shadow-sm btn-sm btn-md-base py-2 px-3"
            >
              <i className="bi bi-plus-lg me-1"></i> Add Post
            </Link>
          </div>
        </div>
      </div>

      {/* Filter Bar: Responsive Grid */}
      <div className="ui-card p-3 mb-4 shadow-sm border-0">
        <div className="row g-2 align-items-center">
          {/* Search - Full width on small, half on medium */}
          <div className="col-12 col-lg-6">
            <div className="position-relative">
              <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
              <input
                type="text"
                className="form-control bg-light border-0 ps-5 py-2 shadow-none w-100"
                placeholder="Search post titles..."
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>
          </div>
          {/* Category - Half width on mobile */}
          <div className="col-6 col-lg-3">
            <select
              className="form-select border-0 bg-light fw-bold text-navy shadow-none py-2 h-100"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All Categories</option>
              <option value="Technology">Technology</option>
              <option value="Design">Design</option>
              <option value="Business">Business</option>
              <option value="Lifestyle">Lifestyle</option>
            </select>
          </div>
          {/* Status - Half width on mobile */}
          <div className="col-6 col-lg-3">
            <select
              className="form-select border-0 bg-light fw-bold text-navy shadow-none py-2 h-100"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All Status</option>
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Area: Scrollable on mobile */}
      <div className="ui-card overflow-hidden shadow-sm border-0">
        <div className="table-responsive">
          <table className="table table-hover m-0 align-middle">
            <thead className="bg-light border-bottom">
              <tr className="small text-uppercase text-muted fw-bold text-nowrap">
                <th className="p-3">ID</th>
                <th>TITLE</th>
                <th>AUTHOR</th>
                <th>CATEGORY</th>
                <th>STATUS</th>
                <th>CREATED</th>
                <th className="text-center">ACTION</th>
              </tr>
            </thead>
            <tbody
              style={{
                opacity: loading ? 0.5 : 1,
                transition: "opacity 0.3s ease-in-out",
              }}
            >
              {blogs.length > 0
                ? blogs.map((blog, index) => (
                    <tr key={blog._id} className="border-bottom-0">
                      <td className="p-3 text-muted">
                        {(page - 1) * 5 + index + 1}
                      </td>
                      <td>
                        <span
                          className="fw-bold text-navy d-block"
                          style={{ minWidth: "150px" }}
                        >
                          {formatTitle(blog.title)}
                        </span>
                      </td>
                      <td className="text-secondary text-nowrap">
                        {blog.authorName}
                      </td>
                      <td>
                        <span className="small fw-semibold">
                          {blog.category}
                        </span>
                      </td>
                      <td>
                        <span
                          className={
                            blog.status === "Published"
                              ? "badge-pub"
                              : "badge-draft"
                          }
                        >
                          {blog.status}
                        </span>
                      </td>
                      <td className="small text-muted text-nowrap">
                        {formatDate(blog.createdAt)}
                      </td>
                      <td className="text-center">
                        <div className="d-flex justify-content-center gap-1">
                          <Link
                            to={
                              blog.slug && blog.slug !== "undefined"
                                ? `/view/${blog.slug}`
                                : `/view/${blog._id || blog.id}`
                            }
                            className="btn btn-sm btn-light text-primary border shadow-sm px-2"
                          >
                            <i className="bi bi-eye"></i>
                          </Link>
                          <Link
                            to={`/edit/${blog._id}`}
                            className="btn btn-sm btn-light text-warning border shadow-sm px-2"
                          >
                            <i className="bi bi-pencil"></i>
                          </Link>
                          <button
                            onClick={() => deleteBlogById(blog._id)}
                            className="btn btn-sm btn-light text-danger border shadow-sm px-2"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                : !loading && (
                    <tr>
                      <td colSpan="7" className="text-center p-5 text-nowrap">
                        <i className="bi bi-folder2-open text-muted fs-1"></i>
                        <p className="text-muted mt-2 fw-bold">
                          No results found.
                        </p>
                      </td>
                    </tr>
                  )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer: Responsive */}
        <div className="p-3 bg-light border-top">
          <Pagination
            page={page}
            totalPages={meta.totalPages}
            totalRecords={meta.totalRecords}
            blogsLength={blogs.length}
            setPage={setPage}
          />
        </div>
      </div>
    </div>
  );
};

export default BlogList;
