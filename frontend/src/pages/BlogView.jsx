import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import blogService from "../services/blogService";
import { toast } from "react-toastify";

const BlogView = () => {
  const { identifier } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!identifier || identifier === "undefined") {
        console.error("Blog identifier is missing from URL");
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const isObjectId = /^[0-9a-fA-F]{24}$/.test(identifier);
        const data = isObjectId
          ? await blogService.getBlogById(identifier)
          : await blogService.getBlogBySlug(identifier);
        setBlog(data);
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error("Could not load blog details");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [identifier]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="container mt-5 text-center">
        <h2>Post Not Found</h2>
        <Link to="/">Back to Home</Link>
      </div>
    );
  }

  const formatStatus = (status) => {
    if (!status) return "";
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  return (
    <div className="container py-4 py-md-5">
      <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
        <div className="row g-0">
          <div className="col-md-5">
            <div
              className="h-100 w-100 bg-light"
              style={{ minHeight: "300px" }}
            >
              {blog.thumbnailUrl ? (
                <img
                  src={blog.thumbnailUrl}
                  alt={blog.title}
                  className="img-fluid w-100 h-100"
                  style={{ objectFit: "cover" }}
                />
              ) : (
                <div className="d-flex align-items-center justify-content-center h-100 text-muted">
                  <i className="bi bi-image fs-1"></i>
                </div>
              )}
            </div>
          </div>

          <div className="col-md-7 p-4 p-lg-5">
            <div className="mb-3">
              <span className="badge bg-warning text-dark px-3 py-2 text-uppercase fw-bold shadow-sm">
                {blog.category}
              </span>
            </div>
            <h1 className="fw-bold text-navy mb-3 display-6">{blog.title}</h1>
            <div className="mb-4">
              <h5 className="mb-0 fw-bold text-primary">{blog.authorName}</h5>
              <p className="text-muted small">{blog.email}</p>
            </div>
            <div className="d-flex justify-content-between border-top pt-3">
              <div className="text-muted small">
                <i className="bi bi-calendar3 me-2"></i>
                {new Date(blog.createdAt).toDateString()}
              </div>
              <div
                className={`fw-bold small ${blog.status === "Published" ? "text-success" : "text-warning"}`}
              >
                {formatStatus(blog.status)}
              </div>
            </div>
          </div>
        </div>

        <div className="card-body p-4 p-lg-5 border-top">
          {blog.shortDescription && (
            <div className="mb-5">
              <h4 className="fw-bold text-navy border-start border-4 border-warning ps-3 mb-3">
                Summary
              </h4>
              <p className="fs-5 text-secondary fst-italic">
                {blog.shortDescription}
              </p>
            </div>
          )}
          <div className="content-area">
            <h4 className="fw-bold text-navy mb-4">Content</h4>
            <div style={{ whiteSpace: "pre-line", lineHeight: "1.8" }}>
              {blog.content}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 text-center">
        <Link
          to="/"
          className="btn btn-link text-decoration-none text-muted fw-bold"
        >
          <i className="bi bi-arrow-left me-2"></i>Back to List
        </Link>
      </div>
    </div>
  );
};

export default BlogView;
